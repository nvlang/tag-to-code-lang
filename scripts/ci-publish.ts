/**
 * Idempotent publish script for npm + JSR.
 *
 * Checks each registry for the version in `package.json` and skips
 * the corresponding publish if it's already there. Makes the release
 * workflow safe to re-run after a transient failure without re-publish
 * errors, and a no-op when there's nothing new to ship.
 */

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

interface Manifest {
    name: string;
    version: string;
}

interface JsrMeta {
    versions?: Record<string, unknown>;
}

const npmPkg = JSON.parse(readFileSync('package.json', 'utf8')) as Manifest;
const jsrPkg = JSON.parse(readFileSync('jsr.json', 'utf8')) as Manifest;

const run = (cmd: string): void => {
    execSync(cmd, { stdio: 'inherit' });
};

/**
 * Whether the exact version is already published to npm.
 *
 * `npm view <name>@<version> version` exits 0 and prints the version only
 * when it exists; both "package not published" and "version not published"
 * yield `E404`. We treat E404 as "go publish" but rethrow any other error
 * (network, auth, registry 5xx) so a transient read failure can't silently
 * turn into a doomed republish attempt that fails the job with a 403.
 */
function npmHasVersion(name: string, version: string): boolean {
    try {
        const out = execSync(`npm view ${name}@${version} version`, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
        return out === version;
    } catch (err) {
        const stderr = (err as { stderr?: Buffer | string }).stderr;
        const text =
            typeof stderr === 'string' ? stderr : (stderr?.toString() ?? '');
        if (text.includes('E404')) return false;
        throw err;
    }
}

/**
 * Whether the version is already published to JSR. A 404 means the package
 * isn't on JSR yet (first publish); any other non-OK response or a network
 * failure is rethrown rather than masked as "not published".
 */
async function jsrHasVersion(name: string, version: string): Promise<boolean> {
    let res: Response;
    try {
        res = await fetch(`https://jsr.io/${name}/meta.json`);
    } catch (err) {
        throw new Error(`Failed to reach JSR for ${name}`, { cause: err });
    }
    if (res.status === 404) return false;
    if (!res.ok) {
        throw new Error(
            `JSR meta.json for ${name} returned HTTP ${res.status}`,
        );
    }
    const meta = (await res.json()) as JsrMeta;
    return version in (meta.versions ?? {});
}

const npmAlready = npmHasVersion(npmPkg.name, npmPkg.version);
const jsrAlready = await jsrHasVersion(jsrPkg.name, jsrPkg.version);

console.info(
    `npm: ${npmPkg.name}@${npmPkg.version} — ${npmAlready ? 'present' : 'missing'}`,
);
console.info(
    `jsr: ${jsrPkg.name}@${jsrPkg.version} — ${jsrAlready ? 'present' : 'missing'}`,
);

if (npmAlready) {
    console.info(
        `✓ ${npmPkg.name}@${npmPkg.version} already on npm; skipping.`,
    );
} else {
    run('pnpm publish --provenance --access public --no-git-checks');
}

if (jsrAlready) {
    console.info(
        `✓ ${jsrPkg.name}@${jsrPkg.version} already on JSR; skipping.`,
    );
} else {
    run('pnpm exec jsr publish --allow-dirty');
}

// `changeset tag` creates local git tags. With `commitMode: github-api`
// in release.yml, changesets/action handles tag pushing via the API, so
// this is mostly belt-and-suspenders for non-CI runs. Tolerate "tag
// already exists" errors silently.
try {
    run('pnpm exec changeset tag');
} catch {
    console.info('changeset tag: nothing to tag or tags already exist.');
}

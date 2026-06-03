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

function getNpmVersion(name: string): string | null {
    try {
        const out = execSync(`npm view ${name} version`, {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe'],
        }).trim();
        return out.length > 0 ? out : null;
    } catch {
        return null;
    }
}

async function jsrHasVersion(name: string, version: string): Promise<boolean> {
    try {
        const r = await fetch(`https://jsr.io/${name}/meta.json`);
        if (!r.ok) return false;
        const meta = (await r.json()) as JsrMeta;
        return version in (meta.versions ?? {});
    } catch {
        return false;
    }
}

const npmRemote = getNpmVersion(npmPkg.name);
const jsrAlready = await jsrHasVersion(jsrPkg.name, jsrPkg.version);

console.info(`npm local: ${npmPkg.name}@${npmPkg.version}`);
console.info(`npm has:   ${npmRemote ?? '(nothing)'}`);
console.info(`jsr local: ${jsrPkg.name}@${jsrPkg.version}`);
console.info(`jsr has:   ${jsrAlready ? jsrPkg.version : '(not this version)'}`);

if (npmRemote === npmPkg.version) {
    console.info(`✓ ${npmPkg.name}@${npmPkg.version} already on npm; skipping.`);
} else {
    run('pnpm publish --provenance --access public --no-git-checks');
}

if (jsrAlready) {
    console.info(`✓ ${jsrPkg.name}@${jsrPkg.version} already on JSR; skipping.`);
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

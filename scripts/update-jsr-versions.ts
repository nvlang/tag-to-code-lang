/**
 * Mirrors the root package.json's version into the root jsr.json so JSR
 * publishes the same version as npm. Invoked from `pnpm ci:version` after
 * changesets has bumped package.json.
 */

import { readFileSync, writeFileSync } from 'node:fs';

interface VersionedJson {
    version?: string;
    [key: string]: unknown;
}

function readJson(filePath: string): VersionedJson {
    return JSON.parse(readFileSync(filePath, 'utf8')) as VersionedJson;
}

function writeJson(filePath: string, obj: unknown): void {
    writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function getVersion(filePath: string): string {
    const v = readJson(filePath).version;
    if (typeof v !== 'string') {
        throw new Error(`No string \`version\` in ${filePath}`);
    }
    return v;
}

const npmVersion = getVersion('package.json');
const jsrVersion = getVersion('jsr.json');

if (npmVersion === jsrVersion) {
    console.info(`jsr.json already at ${npmVersion}.`);
} else {
    const jsr = readJson('jsr.json');
    jsr.version = npmVersion;
    writeJson('jsr.json', jsr);
    console.info(`Updated jsr.json: ${jsrVersion} → ${npmVersion}.`);
}

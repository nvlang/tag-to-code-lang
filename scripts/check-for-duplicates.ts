import { data } from '$external/data.js';
import { inspect } from 'node:util';
import process from 'node:process';

function arrayMinus(a: unknown[], b: unknown[]) {
    b.forEach((y) => {
        a[a.indexOf(y)] = null;
    });
    return a.filter((x) => x !== null);
}

const vals = data.flatMap(([, v]) => v);
const dupes = arrayMinus(vals, [...new Set(vals)]);
if (dupes.length > 0) {
    process.stderr.write('⚠ Duplicate values found:\n' + inspect(dupes));
    process.exit(1);
} else {
    process.stdout.write('✔ No duplicates found.');
    process.exit(0);
}

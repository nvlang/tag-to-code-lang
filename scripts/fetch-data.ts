import fetch from 'node-fetch';
import { load } from 'js-yaml';
import { writeFile } from 'fs/promises';
import { format } from 'prettier';

await writeFile(
    'src/external/data.ts',
    await format(
        '/**\n' +
            ' * Array of 2-tuples, where each 2-tuple has a programming language\'s "display\n' +
            ' * name" as the first element, and an array of aliases as the second element.\n' +
            ' *\n' +
            ' * @remarks\n' +
            ' * The sanitized display name is included in the array of aliases.\n' +
            ' *\n' +
            ' * @remarks\n' +
            ' * The data is fetched and adapted from the `languages.yml` file from the\n' +
            ' * [GitHub Linguist](https://github.com/github-linguist/linguist) repository.\n' +
            ' */\n' +
            'export const data = ' +
            JSON.stringify(await fetchData(), null, 4) +
            ' as const;\n',
        { parser: 'typescript', tabWidth: 4, singleQuote: true },
    ),
);

/**
 * Fetches the languages.yml file from the GitHub Linguist repository and
 * processes the data.
 */
async function fetchData() {
    const yml = await (
        await fetch(
            'https://cdn.jsdelivr.net/gh/github-linguist/linguist@latest/lib/linguist/languages.yml',
        )
    ).text();

    const data = load(yml) as Record<string, { aliases?: string[] }>;

    const langs: [string, string[]][] = Object.entries(data).map(
        ([lang, { aliases }]) => [
            lang,
            dedupe([lang, ...(aliases ?? [])].map(sanitize)),
        ],
    );

    return langs;
}

/**
 * Removes duplicate elements from an array.
 *
 * @param arr - The array to deduplicate.
 * @returns The "deduplicated" array.
 */
function dedupe(arr: string[]): string[] {
    return [...new Set(arr)];
}

/**
 * Sanitizes a string by lowercasing it and replacing whitespace with dashes. If
 * multiple consecutive whitespace characters are present, they are replaced by
 * a single dash.
 *
 * @param str - The string to sanitize.
 * @returns The sanitized string.
 */
function sanitize(str: string) {
    return str.trim().toLowerCase().replace(/\s+/g, '-');
}

import { load } from 'js-yaml';
import { writeFile } from 'fs/promises';
import { format } from 'prettier';

const langs = await fetchData();

assertSeparatorsAbsent(langs);

const raw = langs
    .map(([name, aliases]) => [name, ...aliases].join('\t'))
    .join('\n');

const typeShape = langs
    .map(
        ([name, aliases]) =>
            `readonly [${JSON.stringify(name)}, readonly [${aliases.map((a) => JSON.stringify(a)).join(', ')}]]`,
    )
    .join(',\n    ');

const source = `/**
 * Array of 2-tuples, where each 2-tuple has a programming language's "display
 * name" as the first element, and an array of aliases as the second element.
 *
 * @remarks
 * The sanitized display name is included in the array of aliases.
 *
 * @remarks
 * The data is fetched and adapted from the \`languages.yml\` file from the
 * [GitHub Linguist](https://github.com/github-linguist/linguist) repository.
 *
 * @remarks
 * The runtime representation is a tab-delimited string parsed once at module
 * load. The literal tuple type carries the precise \`CodeLang\` / \`CodeTag\`
 * narrowing without ever reaching the compiled JS output.
 */
export type DataType = readonly [
    ${typeShape},
];

const RAW = ${JSON.stringify(raw)};

export const data: DataType = RAW.split('\\n').map((line) => {
    const [name, ...aliases] = line.split('\\t');
    return [name, aliases] as const;
}) as unknown as DataType;
`;

await writeFile(
    'src/external/data.ts',
    await format(source, {
        parser: 'typescript',
        tabWidth: 4,
        singleQuote: true,
    }),
);

/**
 * Fetches the languages.yml file from the GitHub Linguist repository and
 * processes the data.
 */
async function fetchData(): Promise<[string, string[]][]> {
    const yml = await (
        await fetch(
            'https://cdn.jsdelivr.net/gh/github-linguist/linguist@latest/lib/linguist/languages.yml',
        )
    ).text();

    const data = load(yml) as Record<string, { aliases?: string[] }>;

    return Object.entries(data).map(([lang, { aliases }]) => [
        lang,
        dedupe([lang, ...(aliases ?? [])].map(sanitize)),
    ]);
}

/**
 * Bails out if any name or alias contains the tab or newline delimiters used
 * by the compact runtime format — better to fail loudly during generation than
 * to ship corrupted data.
 */
function assertSeparatorsAbsent(entries: [string, string[]][]): void {
    const sus = (s: string) => s.includes('\t') || s.includes('\n');
    for (const [name, aliases] of entries) {
        if (sus(name)) {
            throw new Error(
                `Display name contains a tab or newline: ${JSON.stringify(name)}`,
            );
        }
        for (const alias of aliases) {
            if (sus(alias)) {
                throw new Error(
                    `Alias contains a tab or newline: ${JSON.stringify(alias)}`,
                );
            }
        }
    }
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
    return str.trim().toLowerCase().replace(/\s+/gu, '-');
}

import { data } from './external/data.js';
export { data } from './external/data.js';

/**
 * Type union of all code languages. By "code language", we mean any language
 * present in the `languages.yml` file fetched from the
 * `github-linguist/linguist` repository.
 */
export type CodeLang = (typeof data)[number][0];

/**
 * Type union of all code tags. By "code tag", we mean any (sanitized) code
 * language or alias thereof present in the `languages.yml` file fetched from
 * the `github-linguist/linguist` repository. By "sanitized", we mean that the
 * strings undergo the following sanitization process:
 *
 * 1.  Trim of leading and trailing whitespace: `str.trim()`.
 * 2.  Transform to lowercase: `str.toLowerCase()`.
 * 3.  Replace all whitespace with dashes: `str.replace(/\s+/g, '-')`.
 */
export type CodeTag = (typeof data)[number][1][number];

/**
 * Type guard for {@link CodeTag | `CodeTag`}.
 *
 * @param str - The string to check.
 * @returns Whether the string is a valid code tag.
 */
export function isCodeTag(str: string): str is CodeTag {
    return (data as unknown as [string, string[]][]).some(([, tags]) =>
        tags.includes(str),
    );
}

/**
 * Type guard for {@link CodeLang | `CodeLang`}.
 *
 * @param str - The string to check.
 * @returns Whether the string is a valid code language.
 */
export function isCodeLang(str: string): str is CodeLang {
    return (data as unknown as [string, string[]][]).some(
        ([lang]) => lang === str,
    );
}

/**
 * Function which takes a "language tag", as may be found at the beginning of
 * fenced code blocks in markdown, and returns the corresponding language name
 * as defined in the `languages.yml` file fetched from the
 * `github-linguist/linguist` repository.
 *
 * @remarks
 * The input is sanitized before being matched against the (also sanitized)
 * aliases and names in the `languages.yml` file. The sanitization process is as
 * follows:
 *
 * 1.  Trim of leading and trailing whitespace: `str.trim()`.
 * 2.  Transform to lowercase: `str.toLowerCase()`.
 * 3.  Replace all whitespace with dashes: `str.replace(/\s+/g, '-')`.
 *
 * @example
 * ```ts
 * tagToCodeLang('js'); // 'JavaScript'
 * tagToCodeLang('javascript'); // 'JavaScript'
 * tagToCodeLang('typescript'); // 'TypeScript'
 * ```
 */
export function tagToCodeLang(tag: CodeTag): CodeLang | undefined {
    // Ensure tag is lowercase
    tag = tag.trim().toLowerCase().replace(/\s+/gu, '-') as CodeTag;
    return data.find(([, tags]) =>
        (tags as unknown as string[]).includes(tag),
    )?.[0];
}

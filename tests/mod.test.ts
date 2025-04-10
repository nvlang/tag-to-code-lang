import {
    type CodeLang,
    type CodeTag,
    isCodeLang,
    isCodeTag,
    tagToCodeLang,
} from '../src/mod.js';
import { describe, expect, test } from 'vitest';

describe('tagToCodeLang', () => {
    describe('positive matches', () => {
        test.each([
            ['c', 'C'],
            ['cpp', 'C++'],
            ['ebnf', 'EBNF'],
            ["ren'py", "Ren'Py"],
            ["cap'n-proto", "Cap'n Proto"],
            ['1C enterprise', '1C Enterprise'],
            ['CaDeNcE', 'Cadence'],
        ] as [CodeTag, CodeLang][])(`%s`, (tag, lang) => {
            expect(tagToCodeLang(tag)).toEqual(lang);
        });
    });
    describe('negative matches', () => {
        test.each(['something', 'not-a-language', 'py', 'h', '.h'])(
            `%s`,
            (tag) => {
                expect(tagToCodeLang(tag as CodeTag)).toBeUndefined();
            },
        );
    });
});

describe('isCodeTag', () => {
    describe('positive matches', () => {
        test.each(['c', 'cpp'])(`%s`, (tag) => {
            expect(isCodeTag(tag)).toBe(true);
        });
    });
    describe('negative matches', () => {
        test.each(['something', 'not-a-language'])(`%s`, (tag) => {
            expect(isCodeTag(tag)).toBe(false);
        });
    });
});

describe('isCodeLang', () => {
    describe('positive matches', () => {
        test.each(['C', 'C++'])(`%s`, (lang) => {
            expect(isCodeLang(lang)).toBe(true);
        });
    });
    describe('negative matches', () => {
        test.each(['something', 'not-a-language'])(`%s`, (lang) => {
            expect(isCodeLang(lang)).toBe(false);
        });
    });
});

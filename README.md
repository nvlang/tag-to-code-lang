<br>
<div align="center">
<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/nvlang/sveltex/main/res/dark/logo.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/nvlang/sveltex/main/res/light/logo.svg">
    <img alt="Logo" src="https://raw.githubusercontent.com/nvlang/sveltex/main/res/light/logotype.svg" width="90%">
</picture>
<br>
<br>
<div>

[<picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/v/tag/nvlang/tag-to-code-lang?style=flat-square&logo=GitHub&logoColor=a3acb7&label=&labelColor=21262d&color=21262d"><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/github/v/tag/nvlang/tag-to-code-lang?style=flat-square&logo=GitHub&logoColor=24292f&label=&labelColor=eaeef2&color=eaeef2"><img alt="GitHub version tag" src="https://img.shields.io/github/v/tag/nvlang/tag-to-code-lang?style=flat-square&logo=GitHub&logoColor=24292f&label=&labelColor=eaeef2&color=eaeef2"></picture>](https://github.com/nvlang/tag-to-code-lang)
[<picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/@nvl/tag--to--code--lang-_?style=flat-square&logo=npm&logoColor=a3acb7&labelColor=21262d&color=21262d&logoSize=auto)"><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/@nvl/tag--to--code--lang-_?style=flat-square&logo=npm&logoColor=24292f&labelColor=eaeef2&color=eaeef2&logoSize=auto)"><img alt="NPM package name" src="https://img.shields.io/badge/@nvl/tag--to--code--lang-_?style=flat-square&logo=npm&logoColor=24292f&labelColor=eaeef2&color=eaeef2&logoSize=auto)"></picture>](https://npmjs.com/@nvl/tag-to-code-lang)
[<picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/@nvl/tag-to-code-lang-_?style=flat-square&labelColor=21262d&color=21262d&logo=jsr&logoColor=a3acb7&logoSize=auto"><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/@nvl/tag-to-code-lang-_?style=flat-square&labelColor=eaeef2&color=eaeef2&logo=jsr&logoColor=24292f&logoSize=auto"><img alt="JSR package name" src="https://img.shields.io/badge/@nvl/tag-to-code-lang-_?style=flat-square&labelColor=eaeef2&color=eaeef2&logo=jsr&logoColor=24292f&logoSize=auto"></picture>](https://jsr.io/@nvl/tag-to-code-lang)
[<picture><source media="(prefers-color-scheme: dark)" srcset="https://jsr.io/badges/@nvl/tag-to-code-lang/score?style=flat-square&labelColor=21262d&color=21262d&logoColor=a3acb7"><source media="(prefers-color-scheme: light)" srcset="https://jsr.io/badges/@nvl/tag-to-code-lang/score?style=flat-square&labelColor=eaeef2&color=eaeef2&logoColor=24292f"><img alt="JSR score" src="https://jsr.io/badges/@nvl/tag-to-code-lang/score?style=flat-square&labelColor=eaeef2&color=eaeef2&logoColor=24292f"></picture>](https://jsr.io/@nvl/tag-to-code-lang)
[<picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/codecov/c/github/nvlang/tag-to-code-lang?style=flat-square&logo=codecov&label=&logoColor=a3acb7&labelColor=21262d&color=21262d"><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/codecov/c/github/nvlang/tag-to-code-lang?style=flat-square&logo=codecov&label=&logoColor=24292f&labelColor=eaeef2&color=eaeef2"><img alt="CodeCov Coverage" src="https://img.shields.io/codecov/c/github/nvlang/tag-to-code-lang?style=flat-square&logo=codecov&label=&logoColor=24292f&labelColor=eaeef2&color=eaeef2"></picture>](https://codecov.io/gh/nvlang/tag-to-code-lang)

</div>
</div>

## Getting Started

**Note:** This package is [ESM-only].

### Installation

#### Node.js (v16+)

```sh
pnpm add @nvl/tag-to-code-lang # If using PNPM
bun  add @nvl/tag-to-code-lang # If using Bun
npm  add @nvl/tag-to-code-lang # If using NPM
yarn add @nvl/tag-to-code-lang # If using Yarn
```

#### Deno

```ts
import { tagToCodeLang } from 'https://esm.sh/@nvl/tag-to-code-lang@1';
```

### Usage

```ts
import { tagToCodeLang } from '@nvl/tag-to-code-lang';

console.log(tagToCodeLang('js')); // JavaScript
console.log(tagToCodeLang('ts')); // TypeScript
console.log(tagToCodeLang('rb')); // Ruby
console.log(tagToCodeLang('hs')); // Haskell
```

Note that file extensions are not recognized, as there would be many collisions:

```ts
import { tagToCodeLang } from '@nvl/tag-to-code-lang';

console.log(tagToCodeLang('.h')); // undefined
console.log(tagToCodeLang('h')); // undefined
console.log(tagToCodeLang('cpp')); // C++
console.log(tagToCodeLang('c')); // C
```

If you believe a tag which is not currently recognized _should_ be recognized,
you can open an issue in the
[`github-linguist/linguist`](https://github.com/github-linguist/linguist)
repository asking for the tag to be added to the `aliases` property of the
language inside the
[`languages.yml`](https://github.com/github-linguist/linguist/blob/master/lib/linguist/languages.yml)
file.

## Acknowledgments

This project is merely an interface to data provided by the [GitHub Linguist]
project.

## Similar work

-   `linguist-languages`
    ([NPM](https://www.npmjs.com/package/linguist-languages) /
    [GitHub](https://github.com/ikatyang/linguist-languages)): The
    `languages.yml` file from the GitHub Linguist project, as a JSON object. I
    would've used this project instead of creating a separate one with a similar
    purpose (though for a more specific use case), but I couldn't get it to work
    due to [URL encoded characters in import
    paths](https://github.com/ikatyang/linguist-languages/issues/278).

[GitHub Linguist]: https://github.com/github-linguist/linguist
[ESM-only]:
    https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

<p align="center">
  <a href="https://gulpjs.com">
    <img height="257" width="114" src="https://raw.githubusercontent.com/gulpjs/artwork/master/gulp-2x.png">
  </a>
</p>

# @gulpjs/update-template

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][ci-image]][ci-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Updates a gulpjs repository to match our current scaffold.

## Usage

This is a command-line tool that normalizes all repositories in the gulpjs organization by applying git commits from our [.boilerplate] repository on top of the code that already exists. Running the command `update-template` with no flags will try to detect the version of [.boilerplate] is currently used and apply only the commits necessary. If detection fails or is incorrect, you can use the `--start-tag` and/or `--end-tag` flags explicitly.

```sh
update-template
```

If you resolve any merge conflicts, a file with the `.orig` extension will be created. You should delete these files, as they are just showing the previous conflict.

## Merge tool

A merge tool should must set to resolve any merge conflicts encountered while applying the new boilerplate.

If you use VSCode, you can specify:

```
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait --merge $REMOTE $LOCAL $BASE $MERGED'
```

Git supports vim and emacs out of the box, but you could also use [meld] as a standalone tool if you don't like any of those options.

## API

None, exclusively used as a command-line tool.

## Strict No LLM / No AI Policy

No LLMs for issues.

No LLMs for patches / pull requests.

No LLMs for comments on the bug tracker, including translation.

English is encouraged, but not required. You are welcome to post in your native language and rely on others to have their own translation tools of choice to interpret your words.

## License

MIT

<!-- prettier-ignore-start -->
[.boilerplate]: https://github.com/gulpjs/.boilerplate
[meld]: https://meldmerge.org/
<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
[downloads-image]: https://img.shields.io/npm/dm/@gulpjs/update-template.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@gulpjs/update-template
[npm-image]: https://img.shields.io/npm/v/@gulpjs/update-template.svg?style=flat-square

[ci-url]: https://github.com/gulpjs/update-template/actions/workflows/dev.yml
[ci-image]: https://img.shields.io/github/actions/workflow/status/gulpjs/update-template/dev.yml?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/update-template
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/update-template/main.svg?style=flat-square
<!-- prettier-ignore-end -->

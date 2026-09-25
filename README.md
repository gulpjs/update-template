<p align="center">
  <a href="http://gulpjs.com">
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

[ci-url]: https://github.com/gulpjs/update-template/actions?query=workflow:dev
[ci-image]: https://img.shields.io/github/workflow/status/gulpjs/update-template/dev?style=flat-square

[coveralls-url]: https://coveralls.io/r/gulpjs/update-template
[coveralls-image]: https://img.shields.io/coveralls/gulpjs/update-template/master.svg?style=flat-square
<!-- prettier-ignore-end -->

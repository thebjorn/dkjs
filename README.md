# dkjs

[![Build Status](https://travis-ci.org/thebjorn/dkjs.svg?branch=master)](https://travis-ci.org/thebjorn/dkjs)
[![codecov](https://codecov.io/gh/thebjorn/dkjs/branch/master/graph/badge.svg)](https://codecov.io/gh/thebjorn/dkjs)


![sunburst](https://codecov.io/gh/thebjorn/dkjs/branch/master/graphs/sunburst.svg?token=aHXCDVqDRj)
![commits](https://codecov.io/gh/thebjorn/dkjs/branch/master/graphs/commits.svg?token=aHXCDVqDRj)


note: until WebStorm 2019.1 you'll need to
 - "Help | Find Action..." on the main menu;
 - Type "registry" and click "Registry..." found element;
 - Find jest.test.tree.use.jasmine.reporter key and disable it.

see (https://youtrack.jetbrains.com/issue/WEB-37680) for details.


## To install/build..

1. make sure your `node --version` is 11.9 or better, otherwise install latest from https://nodejs.org/en/
2. install yarn from https://yarnpkg.com/en/
3. then 
```
cd dkjs
yarn
webpack
```

To develop dkjs, use `webpack --watch` instead.

To build a production version run `inv build -f`

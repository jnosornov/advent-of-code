[![pipeline](https://github.com/jnosornov/advent-of-code/actions/workflows/pipeline.yml/badge.svg)](https://github.com/jnosornov/advent-of-code/actions/workflows/pipeline.yml)
[![known vulnerabilities](https://snyk.io/test/github/jnosornov/advent-of-code/badge.svg)](https://snyk.io/test/github/jnosornov/advent-of-code)
[![codecov](https://codecov.io/gh/jnosornov/advent-of-code/branch/main/graph/badge.svg?token=FP108YE1K6)](https://codecov.io/gh/jnosornov/advent-of-code)

# Advent of Code Challenges

Current project solves [advent of code challenges](https://adventofcode.com/), the main goal is to practice data structures and algorithms. Apart from solving coding challenges the project also has some tools integrated to be able to develop and run challenges smoothly, do static code analysis, and check for code vulnerabilities to ensure code quality. Below are the topics we are going to cover in the current documentation.

- [testing](#testing)
- [continuous integration and continuous deployment](#github-actions)
- [static code analysis](#static-code-analysis)
- [scripts](#scripts)

<hr>

#### **Testing**

The project has [mocha](https://mochajs.org/) set up to test the application, currently, there are only unit test, and even though mocha features are allowed to be use the project uses [node built-in assert module](https://nodejs.org/api/assert.html) to test the code.

To check code coverage the project uses [c8](https://github.com/bcoe/c8), use to generate the coverage report which is later upload to [Codecov](https://about.codecov.io/).

#### **Github Actions**

Continuous integration and deployment is done by using github actions, the workflow currently have steps for code linting, tests, check code vulnerabilities, report code coverage, and deploy the code. Checkout the [workflow](https://github.com/jnosornov/advent-of-code/blob/main/.github/workflows/pipeline.yml) for details.

Here are the github integrations done for some workflow steps to work.
- to check secutiry vulnerabilities, an integration was set with [Snyk](https://snyk.io/).
- to check code coverage, an integration was set with [Codecov](https://about.codecov.io/).
- In order to host the application, and integration was set with [render](https://render.com/).


#### **Static Code Analysis**

The tools the project uses for static code analysis are [Snyk](https://snyk.io/), and [eslint](https://eslint.org/).

#### **Scripts**

`yarn lint` - checks for code linting warnings, and errors

`yarn dev:server` - runs a server to expose the project API in development

`yarn dev:challenges` - runs challenges in development

`yarn start` - runs a server to expose the project API in production

`yarn test` - runs unit tests

`yarn test:watch` - runs unit tests in watch mode

`yarn coverage` - checks tests coverage

#### **Running a specific test**

`yarn run test -g "Red-Nosed Sports"`

`yarn run test:watch -g "Red-Nosed Sports"`

 `NODE_ENV=test yarn mocha src/challenges/calorie-counting/calorie-counting.test.js --watch --parallel --require mocha-suppress-logs`
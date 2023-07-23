[![pipeline](https://github.com/jnosornov/advent-of-code/actions/workflows/pipeline.yml/badge.svg)](https://github.com/jnosornov/advent-of-code/actions/workflows/pipeline.yml)
[![known vulnerabilities](https://snyk.io/test/github/jnosornov/advent-of-code/badge.svg)](https://snyk.io/test/github/jnosornov/advent-of-code)
[![codecov](https://codecov.io/gh/jnosornov/advent-of-code/branch/main/graph/badge.svg?token=FP108YE1K6)](https://codecov.io/gh/jnosornov/advent-of-code)

# Advent of Code Challenges

Current project solves advent of [code algorithms challenges](https://adventofcode.com/), the main goal is to practice algorithms and data structures. Apart from solving coding challenges the project also have integrates some tools to develop/run challenges smoothly, do static code analysis, and check for code vulnerabilities to ensure code quality. Below are the topics we are going to cover in the current documentation.

- [testing](#testing)
- [continuous integration and continuous deployment](#githbu-actions)
- [static code analysis](#static-code-analysis)
- [scripts](#scripts)

<hr>

#### **Testing**

The project has [mocha](https://mochajs.org/) set up for testing the application, currently, there are only unit test, and even though mocha features are allowed to be use, the project uses [node built-in assert module](https://nodejs.org/api/assert.html) to test the code.

For checking test coverage the project uses [c8](https://github.com/bcoe/c8), it is used to generate the report that is later upload to [Codecov](https://about.codecov.io/).

#### **Githbu Actions**

Continuous integrations and deployment is done by using github actions, the workflow currently have steps for the linter, the tests, check code vulnerabilities, report code coverage, and deploy the code. Checkout the [Github actions workflow](https://github.com/jnosornov/advent-of-code/blob/main/.github/workflows/pipeline.yml) for details.

In order for some of the workflow steps to work there are some integrations done with github. For the security step, an integration was set with [Snyk](https://snyk.io/), for the coverage step, an integration was set with [Codecov](https://about.codecov.io/), and for the deploy step, and integration was set with [render](https://render.com/).


#### **Static Code Analysis**

The tools the project uses for code static analysis are [Snyk](https://snyk.io/) for checking code vulnerabilities, and [eslint](https://eslint.org/).

#### **Scripts**

`yarn lint` - checks for code linting warnings, and errors

`yarn dev:server` - runs a server to expose the project API for development

`yarn dev:challenges` - runs challenges for development

`yarn start` - runs a server to expose the project API for production

`yarn test` - runs mocha tests

`yarn test:watch` - runs mocha tests in watch mode

`yarn coverage` - checks tests coverage
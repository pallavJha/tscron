#### ts-cron

TS-CRON is a library for cron. It provides a class named `SpecSchedule` that has two methods:
- [`next(cronSyntax:string, date:Date):Date`](https://github.com/pallavJha/tscron/blob/master/src/schedule/schedule.ts#L70)
This method returns a new Date on which the cron is supposed to run after the provided date. For example, if
the current date is: `2020 December 5`, and the cron syntax is `* * 1 * *` then the output will be 
`1/1/2021, 12:00:00 AM`.

- [`describe(cronSyntax:string):string`](https://github.com/pallavJha/tscron/blob/master/src/schedule/schedule.ts#L181)
This method provides a description of the cron syntax. For example, the description for the cron syntax `* * 1 * *` is
`Every minute On Day-Of-Month 1`.

This project comes with a command line cli that can used to test with these two methods:
```bash
$npm run compile

> typescript-project@1.0.0 compile .\typescript-project
> tsc

$node dist/src/cli.js help
ts-cron help:

commands:
next: To print the next date on which the cron is supposed to run
   Option:
       --cron or -c : For the cron Syntax, like, * 12-18/3 * 2 5
describe: To print the cron description
   Option:
       --cron or -c : For the cron Syntax
help: To print help docs
$node dist/src/cli.js next --cron="* * 1 * *"
1/1/2021, 12:00:00 AM
$node dist/src/cli.js next -c="* * 1 * *"
1/1/2021, 12:00:00 AM
$node dist/src/cli.js describe -c="* * 1 * *"
Every minute On Day-Of-Month 1
$node dist/src/cli.js describe -cron="* * 1 * *"
Every minute On Day-Of-Month 1
```

The test cases are created using the `mocha` framework, and it can be executed using the following command:
```bash
$npm test

> typescript-project@1.0.0 test C:\Users\PallavJha\code\typescript-project
> env TS_NODE_COMPILER_OPTIONS='{"module": "commonjs" }' mocha -r ts-node/register test/errors.ts test/**/*.ts



  Error Initialization
    √ invalidBitError
    √ ParseError
    √ InvalidPositionError

  setBits
    √ check bit status for spec 1-5/1
    √ check bit status for spec 1-5/2
    √ check bit status for spec 1-5/3
    √ check bit status for spec 1-5/10
    √ check bit status for spec 0-59/1
    √ check bit status for spec 0-59/5
    √ check bit status for spec 0-59/15

  getRange
    √ * for minute spec
    √ ?/2 for minute spec
    √ 1-30/2 for minute spec
    √ 5/5 must convert to 5-59/5 for minute spec
    √ spec = 1-15 without any step for minute spec
    √ single digit spec = 18 without any step for minute spec
    √ too many hyphens in the spec
    √ too many slashes or steps in the spec
    √ 0 as spec for day of month section
    √ 32 as spec for day of month section
    √ 1-0 as spec for day of month section
    √ Step = 0 for the spec 1-15/0 for day of month section

  mustParseInt
    √ 1 Digit Positive Number
    √ 2 Digit Positive Number
    √ 1 Digit Negative Number
    √ 2 Digit Negative Number

  parse
    √ check the bits for the cron 1 2 3 4 5
    √ check the bits for the cron 1 2 3 4 5
    √ blank string for cron expression
    √ cron expression with invalid number of fields

  Range
    √ constructor

  Describe
    √ test all the cron test cases

  Next
    √ test all the cron test cases


  33 passing (17ms)
```

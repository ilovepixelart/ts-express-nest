
# Nest + Express.js + TypeScript 5

* [nest](https://github.com/nestjs/nest) - nest framework
* [mongoose](https://mongoosejs.com/) - mongodb object modeling
* ~~[ts-migrate-mongoose](https://github.com/ilovepixelart/ts-migrate-mongoose) - mongoose migration framework~~ 🚧
* ~~[ts-patch-mongoose](https://github.com/ilovepixelart/ts-migrate-mongoose) - mongoose patch history & events~~ 🚧
* [ts-cache-mongoose](https://github.com/ilovepixelart/ts-cache-mongoose) - mongoose cache (in-memory, redis) ✅
* [typescript 5](https://www.typescriptlang.org/)

You can run mongo locally using docker:

```bash
docker pull mongo
docker run -p 27017:27017 --name mongo -d mongo
```


[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
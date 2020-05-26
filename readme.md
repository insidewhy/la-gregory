# la-gregory

[![build status](https://circleci.com/gh/insidewhy/la-gregory.png?style=shield)](https://circleci.com/gh/insidewhy/la-gregory)
[![Known Vulnerabilities](https://snyk.io/test/github/insidewhy/la-gregory/badge.svg)](https://snyk.io/test/github/insidewhy/la-gregory)
[![Renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com)

A jest date mocking library.

```typescript

```

## Installation

In `package.json` under the `jest`, create a `setupFiles` array and add `jest-date-mock` to the array.

```js
{
  "jest": {
    "setupFiles": ["jest-date-mock"]
  }
}
```

## Usage

import { setDate, advanceDate, clearDateMock, setPerformanceOffset } from 'la-gregory'

it('messes with date', () => {
  setDate(new Date(1988, 5, 13, 0, 0, 0))

  const now = Date.now()

  advanceDate(3000)
  expect(Date.now() - now).toEqual(3000)

  advanceDate(-1000)
  expect(Date.now() - now).toEqual(2000)
  expect(window.performance.now()).toEqual(2000)

  setPerformanceOffset(-500)
  expect(window.performance.now()).toEqual(1500)

  clearDateMock()
  expect(Date.now().getFullYear()).toBeGreaterThan(1988)
})

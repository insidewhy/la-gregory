let nowDate: number | undefined = undefined

const now = (): number | undefined => nowDate

const mockDateClass = (OriginalDate: DateConstructor): DateConstructor => {
  // if undefined, use real date, or else mock date
  const mockNow = () => (now() === undefined ? OriginalDate.now() : now())

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function Date(...args: any[]): DateConstructor {
    const dateArgs = args.length === 0 ? [mockNow()] : args
    const instance = new OriginalDate(...(dateArgs as ConstructorParameters<DateConstructor>))
    // @ts-ignore
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this))
    return (instance as unknown) as DateConstructor
  }

  Date.prototype = Object.create(OriginalDate.prototype)
  Object.setPrototypeOf(Date, OriginalDate)

  Date.now = () => mockNow()
  Date.__OriginalDate__ = OriginalDate

  return (Date as unknown) as DateConstructor
}

const MockDate = mockDateClass(Date)

if (global.window) {
  // dom env
  global.window.Date = MockDate
  global.window.performance.now = function () {
    return MockDate.now()
  }
} else {
  // node / native env
  global.Date = MockDate
  require('perf_hooks').performance.now = function () {
    return MockDate.now()
  }
}

/**
 * Move date by offset `ms`
 */
export const advanceDate = (ms: number): void => {
  if (nowDate === undefined) {
    nowDate = ms
  } else {
    nowDate += ms
  }
}

/**
 * Set date to absolute value
 */
export const setDate = (dateOrMs: number | Date): void => {
  nowDate = dateOrMs instanceof Date ? dateOrMs.getTime() : dateOrMs
}

/**
 * Clear date mock
 */
export const clearDateMock = (): void => {
  nowDate = undefined
}

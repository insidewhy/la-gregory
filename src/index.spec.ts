import { advanceDate, setDate, setPerformanceOffset, clearDateMock } from '.'

describe('jest-date-mock', () => {
  afterEach(() => {
    clearDateMock()
  })

  it('can mock Date class methods', () => {
    setDate(0)
    // Date isEqual
    expect(new Date()).toEqual(new Date(0))

    // Date.now
    expect(Date.now()).toBe(0)
    expect(+new Date(10000)).toBe(10000)

    // getTime
    expect(new Date().getTime()).toBe(0)
    expect(new Date(10000).getTime()).toBe(10000)

    // instanceof
    expect(new Date()).toBeInstanceOf(Date)

    // 2018-05-27 08:00:00
    expect(new Date(Date.UTC(2018, 5, 27, 0, 0, 0)).getTime()).toBe(1530057600000)
    expect(new Date(2018, 5, 27, 0, 0, 0)).toEqual(new Date('2018-06-27 00:00:00'))

    class DerivedDate extends Date {}
    const derivedDate = new DerivedDate()

    expect(derivedDate).toBeInstanceOf(Date)
    expect(derivedDate).toBeInstanceOf(DerivedDate)
    expect(+derivedDate).toBe(0)

    expect(new Date()).not.toBe(new Date())

    expect(Date.name).toBe('Date')
  })

  it('can mock Date.now', () => {
    setDate(1000)
    expect(Date.now()).toBe(1000)

    setDate(0)
    expect(Date.now()).toBe(0)

    advanceDate(520)
    expect(Date.now()).toBe(520)
  })

  it('can mock performance.now', () => {
    const performance = global.window
      ? global.window.performance
      : require('perf_hooks').performance

    setDate(1000)
    expect(performance.now()).toBe(1000)

    setDate(0)
    expect(performance.now()).toBe(0)

    advanceDate(520)
    expect(performance.now()).toBe(520)

    setPerformanceOffset(-100)
    expect(performance.now()).toBe(420)
  })

  it('setDate can advance time to argument', () => {
    setDate(1000)
    expect(Date.now()).toBe(1000)

    setDate(0)
    expect(Date.now()).toBe(0)
  })

  it('advanceDate can advance time by argument', () => {
    advanceDate(3000)
    const now = Date.now()
    advanceDate(4000)
    expect(Date.now() - now).toBe(4000)

    advanceDate(-4000)
    expect(Date.now() - now).toBe(0)
    advanceDate(0)
    expect(Date.now() - now).toBe(0)
  })

  it('clearDateMock can remove date mocking', () => {
    clearDateMock()
    expect(Date.now() - new Date('2018-05-20').getTime() > 0).toBe(true)

    setDate(0)
    expect(Date.now()).toBe(0)
  })

  it('setDate can accept a Date instead of a number', () => {
    setDate(new Date(2018, 5, 27, 0, 0, 0))

    const now = Date.now()

    // 0 timezone +  timezone offset
    expect(now).toBe(1530057600000 + new Date().getTimezoneOffset() * 60000)

    advanceDate(3000)
    expect(Date.now() - now).toBe(3000)

    advanceDate(-1000)
    expect(Date.now() - now).toBe(2000)
  })
})

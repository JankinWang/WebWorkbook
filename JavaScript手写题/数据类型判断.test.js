const { test, expect } = require('@jest/globals')

function typeOf(obj) {
  const type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
  return type
}

typeOf([]) // 'array'
typeOf({}) // 'object'
typeOf(new Date()) // 'date'

describe('全数据类型测试', function () {
  test('原始类型', () => {
    expect(typeOf(1)).toBe('number')
    expect(typeOf('1')).toBe('string')
    expect(typeOf(true)).toBe('boolean')
    expect(typeOf(false)).toBe('boolean')
    expect(typeOf(null)).toBe('null')
    expect(typeOf(undefined)).toBe('undefined')
    expect(typeOf(Symbol())).toBe('symbol')
    expect(typeOf(1n)).toBe('bigint')
  })

  test('引用类型', () => {
    expect(typeOf({})).toBe('object')
    expect(typeOf([])).toBe('array')
    expect(typeOf(new Date())).toBe('date')
    expect(typeOf(new Set())).toBe('set')
    expect(typeOf(new Map())).toBe('map')
    expect(typeOf(function () {})).toBe('function')
  })
})

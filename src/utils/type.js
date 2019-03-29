// 是否JSON格式对象或者字符串
export function isJSON (str) {
  var ret
  if (isObject(str) || isArray(str)) {
    return true
  }
  try {
    ret = JSON.parse(str)
    return isObject(ret) || isArray(ret)
  } catch (e) {
    console.error(e)
    return false
  }
}

export function isString (val) {
  return Object.prototype.toString.call(val) === '[object String]'
}

export function isObject (val) {
  return Object.prototype.toString.call(val) === '[object Object]'
}

/* 是否数组 */
export function isArray (data) {
  if (!Array.isArray) {
    Array.isArray = function (data) {
      return getType(data) === 'array'
    }
  }
  return Array.isArray(data)
}

/* 是否纯粹对象 */
export function isPlainObject (data) {
  return getType(data) === 'object'
}

/* 数据类型 */
export function getType (val) {
  const typeArr = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object']
  const class2type = []
  typeArr.forEach((v) => {
    class2type[`[object ${v}]`] = v.toLowerCase()
  })
  return val == null ? String(val) : class2type[{}.toString.call(val)] || 'object'
}

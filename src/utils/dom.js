import { getType } from './type'

export function width (el) {
  return el.clientWidth
}

export function height (el) {
  return el.clientHeight
}

export function scrollLeft (el, num) {
  if (num != null) {
    el.scrollLeft = num
  } else {
    return el.scrollLeft
  }
}

export function scrollTop (el, num) {
  if (num != null) {
    el.scrollTop = num
  } else {
    return el.scrollTop
  }
}

export function offset (el) {
  let top = 0
  let left = 0

  while (el.offsetParent) {
    top += el.offsetTop
    left += el.offsetLeft
    el = el.offsetParent
  }

  return {
    top: top,
    left: left
  }
}

export function position (el) {
  return {
    top: el.offsetTop,
    left: el.offsetLeft
  }
}

export function camelCase (str) {
  return str.replace(/[-_\s]+[a-z]/g, function (word) {
    return word.slice(-1).toUpperCase()
  })
}

export function css (el, cssObj = {}) {
  for (let key in cssObj) {
    let prop = camelCase(key)
    let val = cssObj[key]
    el.style[prop] = getType(val) === 'number' ? `${val}px` : val
  }
}

export function hasClass (el, cls) {
  return el.classList.contains(cls)
}

export function addClass (el, cls) {
  el.classList.add(cls)
}

export function removeClass (el, cls) {
  el.classList.remove(cls)
}

export function attr (el, prop, val) {
  if (val != null) {
    el.setAttribute(prop, val)
  } else {
    return el.getAttribute(prop)
  }
}

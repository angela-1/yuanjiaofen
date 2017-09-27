'use strict'

let allow_point = true
let limit_len = 12

function updateInput(lastChar, oldStr) {
  let newStr = oldStr
  let current_len = oldStr.length
  switch (lastChar) {
    case '.':
      if (allow_point) {
        if (oldStr === '') {
          oldStr = '0'
          current_len += 1
        }
        newStr = oldStr + lastChar
        allow_point = false
        limit_len = current_len + 3
      }
      break
    case '0':
      if (current_len > 0 && current_len < limit_len)
        newStr = oldStr + lastChar
      break
    default:
      if (current_len < limit_len)
        newStr = oldStr + lastChar
      break;
  }
  return newStr
}

function reset() {
  limit_len = 12
  allow_point = true
}

export {
  updateInput,
  reset
}

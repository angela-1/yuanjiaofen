export default class Currency {
  _cutLastFour(numberText) {
    let len = numberText.length
    if (len > 4) {
      return numberText.substr(0, len - 4)
    } else {
      return numberText
    }
  }

  _getLastFour(numberText) {
    let len = numberText.length
    if (len > 4) {
      return numberText.substr(-4)
    } else {
      return numberText
    }
  }

  toUpper(number) {
    var intUnit = ['', '拾', '佰', '仟']
    var decUnit = ['分', '角']
    var sectionUnit = ['', '万', '亿']

    var charNumberDict = {
      '0': '零',
      '1': '壹',
      '2': '贰',
      '3': '叁',
      '4': '肆',
      '5': '伍',
      '6': '陆',
      '7': '柒',
      '8': '捌',
      '9': '玖'
    }

    var result = []
    var numArray = number.split('.')

    var intPart = numArray[0]
    if (intPart === '0') {
      intPart = ''
    }
    if (numArray.length === 1) {
      var decPart = ''
    } else {
      decPart = numArray[1]
    }

    let intPartLen = intPart.length
    if (intPartLen > 0) {
      var sectionCount = 0
      if (intPartLen % 4 !== 0) {
        sectionCount = parseInt(intPartLen / 4) + 1
      } else {
        sectionCount = parseInt(intPartLen / 4)
      }

      var sections = []
      var tmp = intPart

      for (var i = 0; i < sectionCount; i++) {
        let strSection = this._getLastFour(tmp)
        let strLen = strSection.length
        let oneSection = {
          strNumber: strSection,
          strLen: strLen,
          isZero: true,
          hasZero: false
        }

        sections.push(oneSection)
        tmp = this._cutLastFour(tmp)
      }

      for (var j = 0; j < sections.length; j++) {
        var restr = ''
        var len = sections[j].strLen

        for (let i = 0; i < sections[j]['strNumber'].length; i++) {
          var c = sections[j]['strNumber'][i]
          if (c === '0') {
            sections[j]['hasZero'] = true
            len -= 1
          } else {
            sections[j]['isZero'] = false
            if (sections[j]['hasZero'] === true) {
              restr += '零'
              sections[j]['hasZero'] = false
            }
            len -= 1
            restr += charNumberDict[c] + intUnit[len]
          }
        }

        if (!sections[j]['isZero']) {
          restr += sectionUnit[j]
        }
        result.push(restr)
      }

      result = result.reverse()
      result.push('圆')

      if (decPart === '' || decPart === '0' || decPart === '00') {
        result.push('整')
      }
    }

    var decSection = {
      strNumber: decPart,
      strLen: decPart.length,
      isZero: true,
      hasZero: false
    }

    restr = ''
    len = 2

    for (let i = 0; i < decPart.length; i++) {
      let c = decPart[i]
      if (c === '0') {
        decSection['hasZero'] = true
        len -= 1
      } else {
        decSection['isZero'] = false
        if (decSection['hasZero'] === true &&
          intPartLen > 0) {
          restr += '零'
          decSection['hasZero'] = false
        }
        len -= 1
        restr += charNumberDict[c] + decUnit[len]
      }
    }

    result.push(restr)

    if (restr.indexOf('分') === -1 &&
      decSection['isZero'] === false) {
      result.push('整')
    }

    var upperText = ''
    for (var r in result) {
      upperText += result[r]
    }
    return upperText
  }
}

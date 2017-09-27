//index.js
//获取应用实例
import Currency from '../../utils/currency.js'
import { updateInput, reset } from '../../utils/util.js'

const app = getApp()

Page({
  data: {
    numStr: '点按输入金额',
    chnStr: '',
    mask: false,
    resultList: [],
    imeoutHandler: 0,
    animationData: {},
    animation1: {}
  },
  //事件处理函数
  bindAddToList() {
    let { numStr, chnStr } = this.data

    if (numStr !== "" && chnStr !== "") {
      let oneLine = {
        num: numStr,
        chn: chnStr
      }

      this.data.resultList.push(oneLine);
      this.setData({
        resultList: this.data.resultList
      });
      this.bindCloseMask()
    }
  },
  bindClearList(e) {
    this.setData({
      numStr: "点按输入金额",
      chnStr: "",
      resultList: []
    })
  },
  bindClear: function () {
    reset()
    this.setData({
      numStr: "",
      chnStr: ""
    })
  },
  bindShowMask(e) {
    this._hideCaption()
    this._animationKbd()

    this.setData({
      numStr: "",
      mask: true
    })
  },
  bindCloseMask() {
    reset()
    this._showCaption()
    this.setData({
      numStr: "点按输入金额",
      chnStr: "",
      mask: false
    })
  },
  bindInputNum: function (e) {
    clearTimeout(this.timeoutHandler)

    let lastChar = e.target.dataset.kw
    let oldStr = this.data.numStr
    let newStr = updateInput(lastChar, oldStr)
    this.setData({
      numStr: newStr
    })
    if (newStr.length > oldStr.length) {
      this._delayTransform(newStr)
    }     
  },
  bindBackspace: function () {
    clearTimeout(this.timeoutHandler)
    let oldStr = this.data.numStr
    let newStr = oldStr.substring(0, oldStr.length - 1)
    this.setData({
      numStr: newStr
    })
    if (newStr.length > 0) {
      this._delayTransform(newStr)
    } else {
      reset()
      this.setData({
        chnStr: ''
      })
    }
  },
  _transform(newStr) {
    return new Promise((resolve, reject) => {
      let tsf = new Currency()
      let result = tsf.toUpper(newStr)
      if (result.length === 0) {
        reject(new Error('转换有误！'))
      } else {
        resolve(result)
      }
    })
  },
  _delayTransform: function (newStr) {
    this.timeoutHandler = setTimeout(() => {
      let upperStr = this._transform(newStr)
      upperStr.then((result) => {
        this.setData({
          chnStr: result
        })
      })
    }, 300)
  },
  _showCaption: function () {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    animation.translateY(0).step()
    this.setData({
      animationData: animation.export()
    })
  },
  _hideCaption: function () {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    animation.translateY(-64).step()
    this.setData({
      animationData: animation.export()
    })
  },
  _animationKbd: function () {
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    })
    // animation.height(0).step()
    console.log('fei')
    this.animation = animation

    animation.translateY(290).step()
    
    this.setData({
      animation1: animation.export()
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animation1: animation.export()
      })
    }.bind(this), 50)
  }
})

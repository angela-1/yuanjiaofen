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
    animationData: {}
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
    animation.translateY(-63).step()
    this.setData({
      animationData: animation.export()
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

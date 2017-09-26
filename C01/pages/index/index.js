// pages/index/indexs.js
'use strict'

import Currency from '../../utils/currency.js'
import { updateInput, reset } from '../../utils/util.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    newNum: "点按即可输入金额",
    newResult: "",
    numList: [],
    timeoutHandler: 0
  },
  bindAddResult: function () {
    let { newNum, newResult } = this.data
    // let value = this.data.newNum
    // let result = this.data.newResult

    if (newNum !== "" && newResult !== "") {
      let oneLine = [{
        num: newNum,
        chn: newResult
      }]

      this.data.numList = oneLine.concat(this.data.numList);
      console.log('sd1')
      this.setData({
        numList: this.data.numList
      });
      this.bindCloseMask()
    }
  },
  bindDelResult: function (e) {
    console.log('sd2')
    
    this.setData({
      newNum: "点按即可输入金额",
      newResult: "",
      numList: []
    })
  },
  bindClear: function () {
    reset()
    console.log('sd3')
    
    this.setData({
      newNum: "",
      newResult: ""
    })
  },
  _transform: function (newStr) {
    let tsf = new Currency()
    let result = tsf.toUpper(newStr)
    console.log('sd4')
    
    this.setData({
      newResult: result
    })
  },
  _transform2(newStr) {
    return new Promise((resolve, reject) => {
      let tsf = new Currency()
      let result = tsf.toUpper(newStr)
      console.log('sd8')
      if (result.length === 0) {
        reject(new Error('转换有误！'))
      } else {
        resolve(result)
      }
    })
  },
  _update_value2: function (newStr) {
    let upperStr = this._transform2(newStr)
    upperStr.then((result) => {
      this.setData({
        newNum: newStr,
        newResult: result
      })
    })
  },
  _update_value: function (newStr, callback) {
    console.log('sd5')
    
    this.setData({
      newNum: newStr
    })
    callback(newStr)
  },
  delayTransform: function (newStr) {
    this.timeoutHandler = setTimeout(() => {
      this._update_value2(newStr)
    }, 500) 
  },
  bindBackspace: function () {
    let oldStr = this.data.newNum
    let newStr = oldStr.substring(0, oldStr.length - 1)
    // this._update_value(newStr, this._transform)
    this.delayTransform(newStr)

  },
  bindShowMask: function (e) {
    console.log('sd6')
    
    this.setData({
      newNum: "",
      mask: true
    })
  },
  bindCloseMask: function () {
    console.log('sd7')
    
    reset()
    this.setData({
      newNum: "点按即可输入金额",
      newResult: "",
      mask: false
    })
  },
  bindInputNum: function (e) {
    clearTimeout(this.ct)
    console.log('ct', this.ct)
    let lastChar = e.target.dataset.kw
    let oldStr = this.data.newNum
    let new_value = updateInput(lastChar, oldStr)
    this.setData({
      newNum: new_value
    })
    if (new_value.length > oldStr.length)
      // this._update_value(new_value, this._transform)
      this.ct = setTimeout(() => {
        this._update_value2(new_value)
      }, 500)
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
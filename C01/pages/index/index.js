//index.js
//获取应用实例
var app = getApp()
import Transform from '../../utils/num2upper.js';
var util = require('../../utils/util.js')

Page({
  data: {
    mask: false,
    newNum: "点按即可输入金额",
    newResult: "",
    numList: []
  },
  bindAddResult: function () {
    var value = this.data.newNum
    var result = this.data.newResult

    if (value !== "" && result !== "") {
      var oneLine = [{
        num: value,
        chn: result
      }]

      this.data.numList = oneLine.concat(this.data.numList);
      this.setData({
        numList: this.data.numList
      });
      this.bindCloseMask()
    }
  },
  bindDelResult: function (e) {
    this.setData({
      newNum: "点按即可输入金额",
      newResult: "",
      numList: []
    })
  },
  bindClear: function () {
    util.reset()
    this.setData({
      newNum: "",
      newResult: ""
    })
  },
  _transform: function (newStr) {
    var tsf = new Transform()
    var result = tsf.toUpper(newStr)
    this.setData({
      newResult: result
    })
  },
  _update_value: function (newStr, callback) {
    this.setData({
      newNum: newStr
    })
    callback(newStr)
  },
  bindBackspace: function () {
    var oldStr = this.data.newNum
    var newStr = oldStr.substring(0, oldStr.length - 1)
    this._update_value(newStr, this._transform)

  },
  bindShowMask: function (e) {
    this.setData({
      newNum: "",
      mask: true
    })
  },
  bindCloseMask: function () {
    util.reset()
    this.setData({
      newNum: "点按即可输入金额",
      newResult: "",
      mask: false
    })
  },
  bindInputNum: function (e) {
    var lastChar = e.target.dataset.kw
    var oldStr = this.data.newNum
    var new_value = util.updateInput(lastChar, oldStr)
    if (new_value.length > oldStr.length)
      this._update_value(new_value, this._transform)
  }
})

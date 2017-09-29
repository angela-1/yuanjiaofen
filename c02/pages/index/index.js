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
    animation1: {},
    startX: {}
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
    if (newStr.length > oldStr.length && newStr !== '.') {
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
  },

  //手指刚放到屏幕触发
  touchS: function (e) {

    console.log("touchS" + e.touches[0].clientX);
    console.log(this.data.resultList);
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },
  //触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    console.log("touchM:" + e);
    var that = this
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      //delBtnWidth 为右侧按钮区域的宽度
      let delBtnWidth = 100
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        console.log('dd')
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.resultList;

      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      console.log('kanind', index, list)

      //更新列表的状态
      this.setData({
        resultList: list
      });
    }
  },
  touchE: function (e) {
    console.log("touchE" + e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;

      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
     
      var txtStyle = disX > 100 ? "left:-" + disX + "px" : "left:0px";
     
      console.log('disx', disX, txtStyle)
      // let txtStyle = ''
      console.log('me')
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.resultList;
      list[index].txtStyle = txtStyle;
      list.splice(index, 1)
      //更新列表的状态
      that.setData({
        resultList: list
      });
    }
  }
})

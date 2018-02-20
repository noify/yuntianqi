//index.js
import { api } from '../../api'
import util from '../../utils/util.js'
//获取应用实例
var app = getApp()
Page({
  data: {
    weather:{},
  },
  // 获取天气信息
  getWeather (location = 'ip', clazz) {
    var _this = this
    wx.showNavigationBarLoading()
    api.getWeather(location, clazz).then(weather => {
      _this.setData({
        weather: weather
      })
      // 设置标题
      wx.setNavigationBarTitle({
        title: weather.name
      })
      wx.setTopBarText({
        text: `${weather.name} ${weather.temperature}°`
      })
    }).catch(e => {
      _this.getWeather(location)
      console.log(e)
    })
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  getLocationWeather () {
    let _this = this
    wx.getLocation({
      success: function (res) {
        let location = `${res.latitude}:${res.longitude}`
        _this.getWeather(location, 'gps')
      },
    })
  },
  onLoad (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.setTopBarText({
      text: 'hello, world!'
    })
    let _this = this
    if (typeof options!== 'undefined' && options.type == 'share'){
      _this.getWeather(options.location)
      //_this.setData({name: shareId})
    } else {
      wx.getStorage({
        key: 'weather',
        success(res) {
          location = res.data.id
          console.log(location)
          if (res.data.tid == 'gps'){
            _this.getLocationWeather()
          } else {
            _this.getWeather(location)
          }
        },
        fail(res) {
          _this.getLocationWeather()
        }
      })
    }
  },
  onShow () {
    let _this = this
    wx.getStorage({
      key: 'chooselocationid',
      success: function(res) {
        let location = res.data
        console.log('onShow', location)
        if (location == 'gps') {
          _this.getLocationWeather()
        } else {
          _this.getWeather(location)
        }
        wx.removeStorage({ key: 'chooselocationid' })
      },
    })
  },
  onPullDownRefresh (){
    let _this = this
    _this.getWeather(_this.data.weather.id)
  },
  onShareAppMessage (res){
    let _this = this
    let name = _this.data.weather.name
    let location = _this.data.weather.id
    return {
      title: `${name}天气`,
      path: `/pages/share/share?cid=${location}`,
      success (res) {
        // 转发成功
      },
      fail (res) {
        // 转发失败
      }
    }
  },
  chooseLocation (){
    wx.navigateTo({
      url: '../chooseLocation/chooseLocation'
    })
  }
})

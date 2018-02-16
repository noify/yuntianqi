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
    Promise.all([api.now(location), api.daily(location), api.life(location)])
      .then(([now, daily, life]) => {
        // 整合 now, daily, life 数据为 weather
        daily = daily.daily
        let today = daily.splice(0, 1)[0]
        daily.map(d => {
          d.date = util.formatDate(d.date, 'M/d')
          return d
        })
        let weather = {
          id: now.location.id, // 城市id
          name: now.location.name, // 城市名
          code: now.now.code, // 天气现象代码
          temperature: now.now.temperature, // 温度
          text: now.now.text, // 天气现象文字
          last_update: now.last_update, // 数据更新时间（该城市的本地时间）
          text_day: today.text_day, // 白天天气现象文字
          code_day: today.code_day, // 白天天气现象代码
          text_night: today.text_night, // 晚间天气现象文字
          code_night: today.code_night, // 晚间天气现象代码
          high: today.high, // 当天最高温度
          low: today.low, // 当天最低温度
          precip: today.precip, // 降水概率，范围0~100，单位百分比
          wind_direction: today.wind_direction, // 风向文字
          wind_direction_degree: today.wind_direction_degree, // 风向角度，范围0~360
          wind_speed: today.wind_speed, // 风速，单位km/h（当unit=c时）、mph（当unit=f时）
          wind_scale: today.wind_scale, // 风力等级
          daily: daily, // 逐日天气预报
          suggestion: life.suggestion // 生活指数 
        }
        if (clazz == 'gps') {
          weather.id = 'gps'
          wx.setStorage({
            key: "gps",
            data: weather
          })
        }
        _this.setData({
          weather: weather
        })
        // 存储 weather
        wx.setStorage({
          key: "weather",
          data: weather
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
          if (location == 'gps'){
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
  onPullDownRefresh (options){
    let _this = this
    wx.getStorage({
      key: 'weather',
      success(res) {
        _this.getWeather(res.data.id)
      },
      fail(res) {
        _this.getWeather('ip')
      }
    })
  },
  onShareAppMessage (res){
    let _this = this
    let name = _this.data.weather.name
    let location = _this.data.weather.id
    return {
      title: `${name}天气`,
      path: `/pages/index/index?type=share&location=${location}`,
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

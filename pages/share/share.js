// pages/share/share.js

//获取应用实例
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weather: { "id": "WTVMWP4TCFT7", "name": "北京", "code": "4", "temperature": "4", "text": "多云", "last_update": "2018-02-17T18:50:00+08:00", "text_day": "多云", "code_day": "4", "text_night": "阴", "code_night": "9", "high": "10", "low": "1", "precip": "", "wind_direction": "东南", "wind_direction_degree": "135", "wind_speed": "15", "wind_scale": "3", "daily": [{ "date": "2/18", "text_day": "小雨", "code_day": "13", "text_night": "小雨", "code_night": "13", "high": "12", "low": "1", "precip": "", "wind_direction": "东", "wind_direction_degree": "90", "wind_speed": "20", "wind_scale": "4" }, { "date": "2/19", "text_day": "小雨", "code_day": "13", "text_night": "阴", "code_night": "9", "high": "7", "low": "0", "precip": "", "wind_direction": "东北", "wind_direction_degree": "45", "wind_speed": "15", "wind_scale": "3" }], "suggestion": { "car_washing": { "brief": "较不宜", "details": "" }, "dressing": { "brief": "较冷", "details": "" }, "flu": { "brief": "易发", "details": "" }, "sport": { "brief": "较不宜", "details": "" }, "travel": { "brief": "适宜", "details": "" }, "uv": { "brief": "最弱", "details": "" } } },
    weatherTa: { "id": "WTVMWP4TCFT7", "name": "北京", "code": "4", "temperature": "4", "text": "多云", "last_update": "2018-02-17T18:50:00+08:00", "text_day": "多云", "code_day": "4", "text_night": "阴", "code_night": "9", "high": "10", "low": "1", "precip": "", "wind_direction": "东南", "wind_direction_degree": "135", "wind_speed": "15", "wind_scale": "3", "daily": [{ "date": "2/18", "text_day": "小雨", "code_day": "13", "text_night": "小雨", "code_night": "13", "high": "12", "low": "1", "precip": "", "wind_direction": "东", "wind_direction_degree": "90", "wind_speed": "20", "wind_scale": "4" }, { "date": "2/19", "text_day": "小雨", "code_day": "13", "text_night": "阴", "code_night": "9", "high": "7", "low": "0", "precip": "", "wind_direction": "东北", "wind_direction_degree": "45", "wind_speed": "15", "wind_scale": "3" }], "suggestion": { "car_washing": { "brief": "较不宜", "details": "" }, "dressing": { "brief": "较冷", "details": "" }, "flu": { "brief": "易发", "details": "" }, "sport": { "brief": "较不宜", "details": "" }, "travel": { "brief": "适宜", "details": "" }, "uv": { "brief": "最弱", "details": "" } } },
    userInfo: {},
    high: 0,
    low: 0,
    speed: 0,
    highTa: 0,
    lowTa: 0,
    speedTa: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    _this.setData({
      userInfo: app.globalData.userInfo
    })
    let cid = typeof options.cid == 'undefined' ? '北京' : options.cid
    _this.getWeather(cid)
    _this.getLocationWeather()
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
  
  },
  calTemperature (t) {
    t = t/1 + 20
    console.log(t)
    if(t <= 0){
      return 0
    } else if (t > 60){
      return 100
    } else {
      return (t/60)*100
    }
  },
  calChan (ta, me) {
    const _this = this
    const calTemperature = _this.calTemperature
    const speed = ta.wind_speed >= me.wind_speed ? ta.wind_speed : me.wind_speed

    _this.setData({
      highTa: calTemperature(ta.high)
    })
    _this.setData({
      lowTa: calTemperature(ta.low)
    })
    _this.setData({
      speedTa: (ta.wind_speed / speed) * 100
    })
    _this.setData({
      high: calTemperature(me.high)
    })
    _this.setData({
      low: calTemperature(me.low)
    })
    _this.setData({
      speed: (me.wind_speed / speed) * 100
    })
  },  
  // 获取天气信息
  getWeather(location = 'ip', clazz) {
    var _this = this
    wx.showNavigationBarLoading()
    app.store.getWeather(location, clazz).then(weather => {
      if (clazz == 'gps') {
        _this.setData({
          weather: weather
        })
      } else {
        _this.setData({
          weatherTa: weather
        })
      }
      console.log(_this.data.weatherTa, _this.data.weather, clazz)
      _this.calChan(_this.data.weatherTa, _this.data.weather, clazz)
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
  getLocationWeather() {
    let _this = this
    wx.getLocation({
      success: function (res) {
        let location = `${res.latitude}:${res.longitude}`
        _this.getWeather(location, 'gps')
      },
    })
  },
  // onShareAppMessage(res) {
  //   let _this = this
  //   let name = _this.data.weather.name
  //   let location = _this.data.weather.id
  //   return {
  //     title: `${name}天气`,
  //     path: `/pages/share/share?cid=${location}`,
  //     success(res) {
  //       // 转发成功
  //     },
  //     fail(res) {
  //       // 转发失败
  //     }
  //   }
  // },
})
//index.js

//获取应用实例
const app = getApp()

Page({
  data: {
    weather: {
      text: '晴',
      temperature: 0,
      suggestion:{},
      wind_scale: 2,
      daily:[
        { icon: 1, high: 0, low: 0 },
        { icon: 1, high: 0, low: 0 }
      ]
    },
  },
  // 获取天气信息
  getWeather (location = 'ip', clazz = '') {
    var _this = this
    wx.showNavigationBarLoading()
    app.store.getWeather(location).then(weather => {
      // 设置标题
      wx.setNavigationBarTitle({
        title: weather.name
      })
      wx.setTopBarText({
        text: `${weather.name} ${weather.temperature}°`
      })
      if (clazz == 'gps'){
        weather.tid = 'gps'
        wx.setStorage({
          key: "gpsWeather",
          data: weather
        })
      }
      _this.setData({
        weather: weather
      })
      wx.setStorage({
        key: "weather",
        data: weather
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
    // wx.showShareMenu({
    //   withShareTicket: true
    // })
    // wx.setTopBarText({
    //   text: 'hello, world!'
    // })
    let _this = this
    wx.getStorage({
      key: 'weather',
      success(res) {
        let d = res.data
        _this.setData({
          weather: d
        })
        if (res.data.tid == 'gps'){
          _this.getLocationWeather()
        } else {
          _this.getWeather(d.id)
          // 未能考虑前期版本流传下来的数据，会导致bug
          if (d.id == 'gps') {
            _this.getWeather(d.name)
          }
        }
      },
      fail(res) {
        _this.getLocationWeather()
      }
    })
  },
  onShow () {
    const _this = this
    const id = app.globalData.chooselocationid
    if (id){
      if (id == 'gps') {
        _this.getLocationWeather()
      } else {
        _this.getWeather(id)
      }
      app.globalData.chooselocationid = null
    }
  },
  onPullDownRefresh () {
    let _this = this
    wx.getStorage({
      key: 'weather',
      success(res) {
        let d = res.data
        _this.setData({
          weather: d
        })
        if (res.data.tid == 'gps') {
          _this.getWeather(_this.data.weather.id, 'gps')
        } else {
          _this.getWeather(_this.data.weather.id)
          // 未能考虑前期版本流传下来的数据，会导致bug
          if (d.id == 'gps') {
            _this.getWeather(d.name)
          }
        }
      },
      fail(res) {
        _this.getLocationWeather()
      }
    })
  },
  onShareAppMessage (res) {
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
  },
  scroll: function (e) {
    console.log(e.detail.scrollTop)
  }
})

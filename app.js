//app.js
import store from 'store/index'

App({
  onLaunch: function() {
    //防止旧版本数据引发的bug
    wx.removeStorageSync('gps')
    // wx.removeStorageSync('weather')
    wx.removeStorageSync('chooselocationid')

    // var indexLocationId = wx.getStorageSync('indexLocationId') || 'gps'

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo()
    // 提前向用户发起授权请求
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
            }
          })
        }
      }
    })
  },
  onShow (e) {
    if (!(e.scene == 1007 || e.scene == 1008) && e.path == 'pages/share/share'){
      try{
        // 需要寻找设置主页的办法，打开分享页以后，无法回到主页
        // 或者特定场景值下，遇到分享页，直接关闭。
        wx.redirectTo({
          url: '/pages/index/index'
        })
      }catch (e) {

      }
    }
  },
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  store: store,
  globalData: {
    userInfo: null
  }
})

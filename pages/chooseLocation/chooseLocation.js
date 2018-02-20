// pages/chooseLocation/chooseLocation.js
import util from '../../utils/util.js'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    weather: {},
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    console.log(this.data.list)
    wx.getLocation({
      success: res => {
        let id = `${res.latitude}:${res.longitude}`
        app.store.now(id).then(weather => {
          weather.last_update = util.formatDate(weather.last_update, 'HH:mm')
          console.log(weather)
          _this.setData({
            weather: weather
          })
        }).catch(e => {
          _this.getWeather(id)
          console.log(e)
        })
      },
    })
    wx.getStorage({
      key: 'locationList',
      success: function(res) {
          Promise.all(res.data.map(d => {
            return app.store.now(d.location.id)
          })).then( r => {
            r.map(d => {
              console.log(util.formatDate(d.last_update, 'HH:mm'))
              d.last_update = util.formatDate(d.last_update, 'HH:mm')
              return d
            })
            _this.setData({
              list: r
            })
            wx.setStorage({
              key: 'locationList',
              data: r,
            })
        })
      },
    })
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
  // 获取天气信息
  getWeather (id) {
    var _this = this
    app.store.now(id).then(weather => {
      _this.setData({
        weather: weather
      })
    }).catch(e => {
      _this.getWeather(id)
      console.log(e)
    })
  },
  addLocation () {
    let _this = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        let location = `${res.latitude}:${res.longitude}`
        app.store.now(location).then(function (d) {
          let list = _this.data.list
          d.last_update = util.formatDate(d.last_update, 'HH:mm')
          list.push(d)
          _this.setData({
            list: list
          })
          wx.setStorage({
            key: 'locationList',
            data: list,
          })
        }, function () {
          // that.onNow(shareId)
        })
      },
    })
  },
  delLocation (e) {
    let _this = this
    let id = e.currentTarget.id
    wx.showActionSheet({
      itemList: ['删除'],
      success: function (res) {
        if (res.tapIndex === 0){
          wx.showModal({
            title: '提示',
            content: '是否删除？',
            success: function (res) {
              if (res.confirm) {
                let list = _this.data.list
                list.splice(id, 1)
                _this.setData({
                  list: list
                })
                wx.setStorage({
                  key: 'locationList',
                  data: list,
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  toIndex(e) {
    let _this = this
    let chooselocationid = e.currentTarget.dataset.chooselocationid
    console.log('toIndex', chooselocationid)
    wx.setStorage({
      key: 'chooselocationid',
      data: chooselocationid,
    })
    wx.navigateBack({
      url: `../index/index`
    })
  }
})
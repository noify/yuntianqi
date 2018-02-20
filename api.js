import util from './utils/util.js'
let yun = {}
const itemsCache = Object.create(null)
let weather = [
  { id: 0, name: '晴', englishName: 'Sunny', icon: '', },
  { id: 1, name: '晴', englishName: 'Clear', icon: '', },
  { id: 2, name: '晴', englishName: 'Fair', icon: '', },
  { id: 3, name: '晴', englishName: 'Fair', icon: '', },
  { id: 4, name: '多云', englishName: 'Cloudy', icon: '', },
  { id: 5, name: '晴间多云', englishName: 'PartlyCloudy', icon: '', },
  { id: 6, name: '晴间多云', englishName: 'PartlyCloudy', icon: '', },
  { id: 7, name: '大部多云', englishName: 'MostlyCloudy', icon: '', },
  { id: 8, name: '大部多云', englishName: 'MostlyCloudy', icon: '', },
  { id: 9, name: '阴', englishName: 'Overcast', icon: '', },
  { id: 10, name: '阵雨', englishName: 'Shower', icon: '', },
  { id: 11, name: '雷阵雨', englishName: 'Thundershower', icon: '', },
  { id: 12, name: '雷阵雨伴有冰雹', englishName: 'ThundershowerWithHail', icon: '', },
  { id: 13, name: '小雨', englishName: 'LightRain', icon: '', },
  { id: 14, name: '中雨', englishName: 'ModerateRain', icon: '', },
  { id: 15, name: '大雨', englishName: 'HeavyRain', icon: '', },
  { id: 16, name: '暴雨', englishName: 'Storm', icon: '', },
  { id: 17, name: '大暴雨', englishName: 'HeavyStorm', icon: '', },
  { id: 18, name: '特大暴雨', englishName: 'SevereStorm', icon: '', },
  { id: 19, name: '冻雨', englishName: 'IceRain', icon: '', },
  { id: 20, name: '雨夹雪', englishName: 'Sleet', icon: '', },
  { id: 21, name: '阵雪', englishName: 'SnowFlurry', icon: '', },
  { id: 22, name: '小雪', englishName: 'LightSnow', icon: '', },
  { id: 23, name: '中雪', englishName: 'ModerateSnow', icon: '', },
  { id: 24, name: '大雪', englishName: 'HeavySnow', icon: '', },
  { id: 25, name: '暴雪', englishName: 'Snowstorm', icon: '', },
  { id: 26, name: '浮尘', englishName: 'Dust', icon: '', },
  { id: 27, name: '扬沙', englishName: 'Sand', icon: '', },
  { id: 28, name: '沙尘暴', englishName: 'Duststorm', icon: '', },
  { id: 29, name: '强沙尘暴', englishName: 'Sandstorm', icon: '', },
  { id: 30, name: '雾', englishName: 'Foggy', icon: '', },
  { id: 31, name: '霾', englishName: 'Haze', icon: '', },
  { id: 32, name: '风', englishName: 'Windy', icon: '', },
  { id: 33, name: '大风', englishName: 'Blustery', icon: '', },
  { id: 34, name: '飓风', englishName: 'Hurricane', icon: '', },
  { id: 35, name: '热带风暴', englishName: 'TropicalStorm	热带风暴', icon: '', },
  { id: 36, name: '龙卷风', englishName: 'Tornado', icon: '', },
  { id: 37, name: '冷', englishName: 'Sunny', icon: '', },
  { id: 38, name: '热', englishName: 'Hot', icon: '', },
  { id: 99, name: '未知', englishName: 'Unknown', icon: '', },
]
//api错误状态代码
let status_code = []
// api 
let apiKey = '?key=lg960uumjd6zdv3z&language=zh-Hans&unit=c'
let apiId = 'UA8EB7F98A'
let apiUrl = 'https://api.seniverse.com/v3'
// let api = [
//   { id: 0, name: '天气实况', type: 'get', url: `${apiUrl}/weather/now.json${apiKey}` }, //
//   { id: 1, name: '逐日天气预报和昨日天气', type: 'get', url: `${apiUrl}/weather/daily.json${apiKey}` }, //&start=0&days=5
//   { id: 2, name: '生活指数', type: 'get', url: `${apiUrl}/life/suggestion.json${apiKey}` }, //
//   { id: 3, name: '城市搜索', type: 'get', url: `${apiUrl}/location/search.json${apiKey}` }, //&q=san&limit=10&offset=10
// ]

let now = function (location = 'ip'){
  return new Promise(function (resolve, reject){
    wx.request({
      url: `${apiUrl}/weather/now.json${apiKey}&location=${location}`,
      success: function (res) {
        resolve(res.data.results[0])
      },
      fail: function (error){
        reject(error)
      }
    })
  })
}
let daily = function (location = 'ip') {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${apiUrl}/weather/daily.json${apiKey}&location=${location}&start=-1&days=5`,
      success: function (res) {
        resolve(res.data.results[0])
      },
      fail: function (error) {
        reject(error)
      }
    })
  })
}
let life = function (location = 'ip') {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: `${apiUrl}/life/suggestion.json${apiKey}&location=${location}`,
      success: function (res) {
        resolve(res.data.results[0])
      },
      fail: function (error) {
        reject(error)
      }
    })
  })
}
let getWeather = function (location = 'ip', clazz = '') {
  // 待更新：按城市id保持天气数据到一个list，每次到list取数据
  // 如果存在该数据并且最后更新时间间隔不大于10分钟
  // 则返回该数据，不请求网络
  return new Promise(function (resolve, reject) {
    if (itemsCache[location] && new Date() - new Date(itemsCache[location].last_update) < 20*60*1000) {
      resolve(itemsCache[location])
    } else {
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
          console.log(JSON.stringify(weather))
          if (clazz == 'gps') {
            weather.tid = 'gps'
            wx.setStorage({
              key: "gps",
              data: weather
            })
          }
          wx.setStorage({
            key: "weather",
            data: weather
          })
          itemsCache[location] = weather
          resolve(weather)
        }).catch(e => {
          reject(e)
        })
    }

  })
}

let search = `${apiUrl}/location/search.json${apiKey}`
export let api = { now, daily, life, getWeather}
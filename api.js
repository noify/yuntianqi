let yun = {}
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

let search = `${apiUrl}/location/search.json${apiKey}`
export let api = {now, daily, life}
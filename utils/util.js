function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatDate(date, format) {
  var paddNum = function (num) {
    num += "";
    return num.replace(/^(\d)$/, "0$1");
  }
  if (typeof date == 'string') {
    //date = new Date(date.replace(/-/g, '/'))
    date = new Date(date)
  }
  //指定格式字符
  var cfg = {
    yyyy: date.getFullYear(),
    yy: date.getFullYear().toString().substring(2),
    MM: paddNum(date.getMonth() + 1),
    M: date.getMonth() + 1,
    dd: paddNum(date.getDate()),
    d: date.getDate(),
    HH: paddNum(date.getHours()),
    mm: paddNum(date.getMinutes()),
    ss: paddNum(date.getSeconds())
  }
  format || (format = 'yyyy-MM-dd HH:mm:ss');
  return format.replace(/([a-z])(\1)*/ig, function (m) { return cfg[m]; });
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate
}

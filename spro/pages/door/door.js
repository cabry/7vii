//logs.js
var util4 = require('../../utils/util4.js')
var app = getApp()

function timing(that) {
  var seconds = that.data.seconds

  setTimeout(function () {
    that.setData({
      seconds: seconds + 1
    });
    timing(that);
  }
    , 1000)
  formatSeconds(that)
}
function formatSeconds(that) {
  var mins = 0, hours = 0, seconds = that.data.seconds, time = ''
  if (seconds < 60) {

  } else if (seconds < 3600) {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
  } else {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
    hours = parseInt(mins / 60)
    mins = mins % 60
  }
  that.setData({
    time: formatTime(hours) + ':' + formatTime(mins) + ':' + formatTime(seconds)
  });
}
function formatTime(num) {
  if (num < 10)
    return '0' + num
  else
    return num + ''
}


Page({
  data: {
    word1: '门已开启',
    word2: '',
    question: '没有开门？遇到问题',
    btn: '结束健身',
    seconds: 0,
    time: '00:00:00'
  },

  go2how: function () {
    wx.navigateToMiniProgram({
      appId: 'wxe1ef8560bf985dd7',
      path: 'pages/index/index',
      extarData: {
        open: 'happy'
      },
      envVersion: 'release',
      success(res) {
        console.log('done')
      }
    })
  },

  stop: function () {
    var that = this
    //结束健身，二次确认
    wx.showModal({
      title: '提示',
      content: '确认结束健身？门将立即开启，请您确保您已经位于店门口，门开启5s后会自动关闭',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: that.data.servers+'sports/checkUserIsSports.do',
            data: {
              "data": {
                "userId": that.data.userId
              }
            },
            method: 'POST',
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              wx.hideLoading();
              wx.navigateTo({
                url: '../../pages/order/order?sportsId=' + res.data.bizData.sportsId + '&storeId=' + that.data.storeId
              })

            },
            fail: function (err) {
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '遇到了点问题，请稍后重试',
                showCancel: false
              })
            }
          })


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  help: function () {
    //跳到帮助页模版，传参数来确定是哪个帮助
    wx.navigateTo({
      url: '../helpDetail/helpDetail?id=5',
    })
  },

  onLoad: function (options) {
    timing(this);
    var that=this;
    wx.showLoading({
      title: '加载中',
    })
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    var date = new Date();
    var isNight = false;
    var isMorning = false
    console.log(date.getHours());


    wx.request({
      url: that.data.servers + '/sports/checkUserIsSports.do',
      data: {
        "data": {
          "userId": that.data.userId
        }
      }, method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        var startTime = res.data.bizData.startTime;
        startTime = util4.formatTime(new Date(startTime))
        var userId = options.userId;
        var storeId = options.storeId;
        var status = options.status;
        var num = options.num;
        var sportsId = options.sportsId;
        that.setData({
          userId: userId,
          storeId: storeId,
          status: status,
          num: num,
          sportsId: sportsId,
          word2: '这是您第' + ' ' + num + ' ' + '次Vii之旅',
          startTime: startTime
        })
        if (date.getHours() > 20) {
          isNight = true;
          wx.showModal({
            title: '提示',
            content: '已经到夜里了哦，大家都睡啦请在健身时，尽量不要打扰到周围的住户',
            showCancel: false,
            confirmText: '知道啦'
          })
        } else if (date.getHours() < 8) {
          isMorning = true;
          wx.showModal({
            title: '提示',
            content: '现在还是清晨呢，大家还没醒哦，请在健身时，尽量不要打扰到周围的住户',
            showCancel: false,
            confirmText: '知道啦'
          })
        }
        that.setData({
          isNight: isNight,
          isMorning: isMorning
        }) 
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '遇到了点问题，请稍后重试',
          showCancel: false
        })
      }
    })

  
    //调用应用实例的方法获取全局数据

  }
})
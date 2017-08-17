//index.js
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
var util4 = require('../../utils/util4.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    gymInfo: [],
    cardUrl: '',
    isSpotrs: '',
    seconds: 0,
    time: '00:00:00',
    btn: '结束健身'
  },

  onShareAppMessage: function (res) {
    return {
      title: '7Vii 健身便利店',
      path: '/pages/index/index',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showModal({
          title: '提示',
          content: '遇到了点问题，请稍后重试',
          showCancel: false
        })
      }
    }
  },

  go2how: function () {
    wx.showLoading({
      title: '加载中',
    })
    wx.navigateToMiniProgram({
      appId: 'wxe1ef8560bf985dd7',
      path: 'pages/index/index',
      extarData: {
        open: 'happy'
      },
      envVersion: 'release',
      success(res) {
        wx.hideLoading();
        console.log('done')
      }
    })
  },

  tabchoose: function () {
    wx.redirectTo({
      url: '../me/me'
    })
  },

  stop: function () {
    var that = this
    //结束健身，二次确认
    wx.showModal({
      title: '提示',
      content: '确认结束健身？门将立即开启，请您确保您已经位于店门口',
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../pages/order/order?sportsId=' + that.data.sportsId + '&storeId=' + that.data.storeId
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  scan: function () {
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },

  onLoad: function () {
    wx.showLoading({
      title: '加载中',
    })

    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    var date = new Date();
    var isNight = false
    var isMorning = false
    console.log(date.getHours());


    wx.getStorage({
      key: 'isIllegal',
      success: function (res) {
        that.setData({
          isIllegal: res.data
        })
      }
    })
    //违规操作提醒
    if (that.data.isIllegal == '2') {
      console.log(that.data.isIllegal)
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '您因为之前的违规操作，已被后台封号处理。如需帮助请联系客服',
        showCancel: false
      })
    } else if (that.data.isIllegal == '1') {
      console.log(that.data.isIllegal)
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '系统检测到您近期有违规行为，为了保证大家的体验请规范健身体验，如果再有类似行为，系统会做出封号处理，请慎重',
        showCancel: false
      })
    }


    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data
        })


        //判断用户是否在健身
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
            if (res.data.bizData.isSports) {
              that.setData({
                isSpotrs: true,
                storeId: res.data.bizData.storeId
              })

              if (date.getHours() > 20) {
                isNight = true
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
              var startTime = res.data.bizData.startTime;
              startTime = util4.formatTime(new Date(startTime))
              console.log('qiehuanla')
              that.setData({
                sportsId: res.data.bizData.sportsId,
                seconds: res.data.bizData.times,
                //word2: '您的Vii之旅已进行',
                startTime: startTime
              })
              timing(that);
            } else {
              that.setData({
                isSpotrs: false
              })

              //获取banner信息
              wx.request({
                url: that.data.servers + '/common/getBannerList.do',
                data: {
                  "data": {
                    "type": "INDEX_PAGE"
                  }
                },
                method: 'POST',
                header: {
                  "Content-Type": "application/json"
                },
                success: function (res) {
                  var temp = res.data.bizData;

                  for (var i = 0; i < res.data.bizData.length; i++) {
                    temp[i].bannerUrl = '../banner/banner?id=' + temp[i].id;
                  }
                  that.setData({
                    bannerData: temp
                  })

                  ///


                },
                fail: function (err) {
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: '遇到了点问题，请稍后重试',
                    showCancel: false
                  })
                }

              }),

                //获取门店信息
                wx.request({
                  url: that.data.servers + '/store/getStoreList.do',
                  data: {
                    "data": {
                      "lat": 34.341568,
                      "lng": 108.940175
                    }
                  },
                  method: 'POST',
                  header: {
                    "Content-Type": "application/json"
                  },
                  success: function (res) {
                    wx.hideLoading();
                    var gymInfo = res.data.bizData;
                    for (var i = 0; i < gymInfo.length; i++) {
                      gymInfo[i].url = "../../pages/gym/gym?id=" + gymInfo[i].storeId;
                    }
                    that.setData({
                      gymInfo: gymInfo
                    })


                  },
                  fail: function (res) {
                    wx.showModal({
                      title: '提示',
                      content: '遇到了点问题，请稍后重试',
                      showCancel: false
                    })
                  },
                  complete: function (res) {
                    // complete
                  }
                })

            }
          }, fail: function (err) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '遇到了点问题，请稍后重试',
              showCancel: false
            })
          }

        })
      }
    })



  }
})


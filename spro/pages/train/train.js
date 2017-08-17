//index.js  
//获取应用实例  
var app = getApp()
var util = require('../../utils/util.js')
var util2 = require('../../utils/util2.js')
Page({
  data: {

    trainData: {},
    empty: ''

  },

  trainView: function () {

  },


  onLoad: function () {
    var that = this;
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data
        })
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
          url: that.data.servers +'/sports/getSportsList.do',
          data: {
            "data": {
              "userId": that.data.userId,
              "requestTime": 0
            }
          },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            wx.hideLoading();
            if (res.data.bizData.length === 0) {
              that.setData({
                empty: true
              })
            } else {
              that.setData({
                empty: false
              })
              var resData = res.data.bizData;
              for (var i = 0; i < resData.length; i++) {
                resData[i].time = util.formatTime(new Date(resData[i].startTime)) + "-" + util2.formatTime(new Date(resData[i].endTime))
                resData[i].url = "../../pages/result/result?sportsId=" + resData[i].sportsId + '&state=0';

                that.setData({
                  trainData: resData
                });
              }
            }


          },
          fail:function(err){
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
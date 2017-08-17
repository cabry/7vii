//logs.js
var app = getApp()
var util = require('../../utils/util.js')
var util2 = require('../../utils/util2.js')


Page({
  data: {
    friends:[
    ],
    state:'',
    codeUrl: 'http://img.pcauto.com.cn/images/upload/upc/tx/auto5/1503/19/c6/4087987_1426732069164.jpg'
  },




  back: function(){
    wx.redirectTo({
      url: '../index/index',
    })
  },

  onLoad: function (options) {
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    var sportsId = options.sportsId;
    var state = options.state;
    that.setData({
      sportsId: sportsId,
      state: state
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.data.servers +'/sports/getSportsInfoById.do',
      data: {
        "data": {
          "sportsId": that.data.sportsId
        }
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        var temp = res.data.bizData
        temp.buildTime = parseInt(temp.buildTime / 60);
        temp.time = util.formatTime(new Date(temp.startTime)) + "-" + util2.formatTime(new Date(temp.endTime));
        
        if (Object.keys(temp.userInfo).length === 0 ){
          temp.words = '哇，没有小伙伴跟你一起，你包场了诶';
        }
        
        that.setData({
          resultInfo: temp,
          userInfo: temp.userInfo
        })

        var tempLine1 = [];
        var tempLine2 = [];
        var k=0;
        var j=0;
        if (temp.userInfo.length > 3){
          for (var i = 0; i < temp.userInfo.length;i++){
            if(i<3){
              tempLine1[j] = temp.userInfo[i];
              j++;
            } else{
              tempLine2[k] = temp.userInfo[i];
              k++;
            }

          }
        }else{
          tempLine1 = temp.userInfo
        }
        that.setData({
          userInfo2 : tempLine2,
          userInfo1: tempLine1
        })
        
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
// goal.js
Page({

  data: {
    goalData: [
      ]
    
  },

  receive:function(res){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.data.servers+'user/exReward.do',
      data: {
        "data": {
          "userId": that.data.userId,
          "rewardId": res.currentTarget.id
        }
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '领取成功，请在代金券页面查看',
          showCancel: false,
          confirmText:'前往查看',
          success: function (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../voucher/voucher',
              })
            }
          }
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
  },

  onLoad: function (options) {   
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    that.setData({
      time: options.time
    })
    console.log('onLoad');
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
          url: that.data.servers+'user/queryUserRewardList.do',
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
            console.log(res.data.bizData.rewardDtos);
            var tempDistance = 0;
            var tempPosition = 0;
            that.setData({
              totalTime: res.data.bizData.totalTime
            })
            var goalData = res.data.bizData.rewardDtos;
            for (var i = 0; i < goalData.length;i++){
              if (goalData[i].isAchieve == '0'){
                goalData[i].satisfaction = false;
                tempDistance = goalData[i].minutes - that.data.totalTime;
                goalData[i].distance = tempDistance
                //goalData[i].txt2 = '距离下一个成就还需要 ' + tempDistance +' 分钟';

                tempPosition = Math.round(that.data.totalTime / goalData[i].minutes * 420)
                console.log('tempPosition');
                console.log(tempPosition);
                goalData[i].width = tempPosition + 'rpx;';
                tempPosition = tempPosition + 145;
                console.log('tempPosition2');
                console.log(tempPosition);
                goalData[i].slide = tempPosition + 'rpx;';

                goalData[i].img = '../../src/imgs/g-' + goalData[i].level + '-off.png'

              }else{
                goalData[i].satisfaction = true
                goalData[i].txt2 = '您已达成该成就！'
                goalData[i].slide = '565rpx;';
                goalData[i].width = '420rpx;';

                goalData[i].img = '../../src/imgs/g-' + goalData[i].level + '-on.png'
                
              }

              if (goalData[i].isExchange == '0'){
                goalData[i].exchange = false
              }else{
                goalData[i].exchange = true
              }

              

              goalData[i].txt1 = '当前累计 ' + that.data.totalTime +' 分钟';
              //goalData[i].txt3 = goalData[i].comment;
              goalData[i].txt3 = goalData[i].comment;
              goalData[i].goal = goalData[i].minutes;
             
            }
            that.setData({
              goalData: goalData
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
      }
    });

  }

  
})
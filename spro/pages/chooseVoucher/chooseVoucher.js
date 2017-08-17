//logs.js
var app = getApp()
var util3 = require('../../utils/util3.js')
Page({
  data: {
    bannerUrl: 'http://oeeqqcyuk.bkt.clouddn.com/banner_01.jpg',
    vouchers: []

  },

  onLoad: function (options) {
    console.log(options.sportsId)
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })

    that.setData({
      sportsId: options.sportsId
    })

    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data
        })

        wx.request({
          url: that.data.servers+'coupon/queryUserCoupons.do',
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
            console.log(res);
            var resData = res.data.bizData.availableInfos;
            for (var i = 0; i < resData.length; i++) {
              resData[i].time = util3.formatTime(new Date(resData[i].startTime)) + "至" + util3.formatTime(new Date(resData[i].endTime))

            }

            that.setData({
              vouchers: resData
            })

          },
          fail: function (err) {
            console.log(err)
          }

        })


      }

    })

    
    //调用应用实例的方法获取全局数据

  },

  chosse:function(res){
    var that=this
    var tempMoney
    console.log('ssasasadsffdf')
    console.log(res.currentTarget.id);

    for (var i = 0; i < that.data.vouchers.length;i++){
      if (that.data.vouchers[i].id == res.currentTarget.id){
        tempMoney = that.data.vouchers[i].couponPrice;
        console.log('find!')
        wx.redirectTo({
          url: '../order/order?sportsId=' + that.data.sportsId + '&voucherId=' + res.currentTarget.id + '&couponPrice=' + tempMoney
        })
        return
      }
    }

    
  }
})
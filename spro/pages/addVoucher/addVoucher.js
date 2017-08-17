//logs.js
var app = getApp()
Page({
  data: {
    vouchers: []

  },

  confirm: function (e) {
    var that = this
    var subData = e.detail.value;
    var flag = true
    for(var i=0;i<subData.length;i++){
      //判断是否有中文
      if (subData.charCodeAt(i) > 255){
        flag = false;
      }
    }

    that.setData({
      flag : flag
    })

    if(flag){
      //单个代金券兑换
      wx.request({
        url: that.data.servers +'coupon/userExSingleCoupon.do',
        data: {
          "data": {
            "userId": that.data.userId,
            "couponCode": subData
          }
        },
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          if (res.data.rtnCode != "0000000") {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '兑换成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../../pages/voucher/voucher'
                  })
                }
              }
            })
          }
        }
      })
    }else{
      //组合代金券兑换
      wx.request({
        url: that.data.servers +'coupon/userExBatchCoupon.do',
        data: {
          "data": {
            "userId": that.data.userId,
            "keyword": subData
          }
        },
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          if (res.data.rtnCode != "0000000") {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '兑换成功',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../../pages/voucher/voucher'
                  })
                }
              }
            })
          }
        }
      })
    }

    
  },

  onLoad: function (options) {
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    //调用应用实例的方法获取全局数据
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data
        })
      }
    })

  }
})






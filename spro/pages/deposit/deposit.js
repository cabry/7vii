//logs.js
var app = getApp()
Page({
  data: {
    cash: '375',
    num: '123',
    txtArray: [],
    flagId: '',
    state: 0,
  },

  

  charge: function () {
    console.log(this.data.flagId);
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.data.servers+'user/commitChargeInfo.do',
      data: {
        "data": {
          "userId": this.data.userId,
          "packageId": "0"
        }
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res);
        wx.request({
          url: that.data.servers+'wxPay/commitOrder.do',
          "data": {
            "data": {
              "userId": that.data.userId,
              "orderNo": res.data.bizData.orderNo,
              "orderType": 2
            }

          },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            
            console.log(res);
            wx.requestPayment({
              timeStamp: res.data.bizData.paymap.timeStamp,
              nonceStr: res.data.bizData.paymap.nonceStr,
              package: res.data.bizData.paymap.package,
              signType: res.data.bizData.paymap.signType,
              paySign: res.data.bizData.paymap.paySign,
              success: function (res) {
                wx.request({
                  url: that.data.servers+'user/checkUserHasPay.do',
                  data: {
                    "data": {
                      "userId": that.data.userId,
                    }
                  },
                  method: 'POST',
                  header: {
                    "Content-Type": "application/json"
                  },
                  success: function (res) {
                    wx.hideLoading();
                    if (res.data.bizData.result) {
                      wx.navigateBack({
                        
                      })
                    }
                  },fail:function(err){
                    wx.hideLoading();
                    wx.showModal({
                      title: '提示',
                      content: '遇到了点问题，请稍后重试',
                      showCancel: false
                    })
                  }
                })
              },
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
    var storeId = options.id;
    console.log(options.id);
    var that = this
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

      }

    })


    
    //调用应用实例的方法获取全局数据


  }
})
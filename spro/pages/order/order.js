//logs.js
var app = getApp()
Page({
  data: {
    sportsInfo: {},
    couponPrice: 0,
    voucherId: 0,
    enough: true,
    attention: false
  },

  order: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    //调微信支付
    wx.request({
      url: that.data.servers+'sports/commitSportsInfo.do',
      data: {
        "data": {
          "userId": this.data.userId,
          "sportsId": this.data.sportsId,
          "couponId": this.data.voucherId
        }
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.bizData.isCharge) {
          //开门
          wx.request({
            url: that.data.servers+'sports/openTheDoorV2.do',
            data: {
              "data": {
                "sportsId": that.data.sportsId,
                "userId": that.data.userId,
                "storeId": that.data.storeId
              }
            },
            method: 'POST',
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
              if (res.data.rtnCode == '0000000') {
                wx.hideLoading();
                wx.reLaunch({
                  url: '../result/result?sportsId=' + that.data.sportsId + '&state=1',
                })
              } else {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  showCancel: false
                })
              }


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

        } else {
          wx.request({
            url: that.data.servers+'wxPay/commitOrder.do',
            "data": {
              "data": {
                "userId": that.data.userId,
                "orderNo": res.data.bizData.orderNo,
                "orderType": 1
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
                  //开门

                  wx.request({
                    url: that.data.servers+'sports/openTheDoorV2.do',
                    data: {
                      "data": {
                        "sportsId": that.data.sportsId,
                        "userId": that.data.userId,
                        "storeId": that.data.storeId
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
                        content: '已经到夜里了哦，大家都睡啦请在健身时，尽量不要打扰到周围的住户',
                        showCancel: false,
                        confirmText: '知道啦',
                        success: function (res) {
                          if (res.confirm) {
                            wx.reLaunch({
                              url: '../result/result?sportsId=' + that.data.sportsId + '&state=1',
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


                }, fail: function (err) {
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
        }


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
    //支付成功进入结果页

  },


  navigate2voucher: function () {
    var that = this
    wx.redirectTo({
      url: '../chooseVoucher/chooseVoucher?sportsId=' + that.data.sportsId,
    })
  },

  onLoad: function (options) {
    var that = this;
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    if (options.sportsId) {
      that.setData({
        sportsId: options.sportsId
      })
    }

    if (options.storeId) {
      that.setData({
        storeId: options.storeId
      })
    }

    if (options.voucherId) {
      that.setData({
        voucherId: options.voucherId
      })
    } else {
      voucherId: 0
    }

    if (options.couponPrice) {
      that.setData({
        couponPrice: options.couponPrice
      })
    } else {
      couponPrice: 0
    }


    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openId: res.data
        })

      }
    });



    //调用应用实例的方法获取全局数据

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
          url: that.data.servers+'sports/getSportsEndInfo.do',
          data: {
            "data": {
              "userId": that.data.userId,
              "sportsId": that.data.sportsId
            }
          },
          method: 'POST',
          header: {
            "Content-Type": "application/json"
          },
          success: function (res) {
            wx.hideLoading();
            console.log(res);
            
            var sportsInfo = res.data.bizData;
            //
            sportsInfo.times = parseInt(sportsInfo.times / 60);
            sportsInfo.voucher = that.data.couponPrice;

            if (sportsInfo.times < 30){
              that.setData({
                attention: true
              })
              if (sportsInfo.balance >30){
                that.setData({
                  enough: true
                })
              }else{
                that.setData({
                  enough: false
                })
                sportsInfo.last = (30 - Number(sportsInfo.balance) - Number(sportsInfo.voucher))* sportsInfo.unitPrice
              }
            }else if (sportsInfo.balance > sportsInfo.times){
              that.setData({
                enough : true
              })
            }else{
              that.setData({
                enough: false
              })
              if (Number(sportsInfo.times) > Number(sportsInfo.balance) + Number(sportsInfo.voucher)){
                sportsInfo.last = (Number(sportsInfo.times) - Number(sportsInfo.balance) - Number(sportsInfo.voucher)) * sportsInfo.unitPrice;
                console.log(sportsInfo.last);
                sportsInfo.last = parseFloat(sportsInfo.last).toFixed(1);
              } else{
                sportsInfo.last = 0
              }
              
            }

            that.setData({
              sportsInfo: sportsInfo
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

    })


  }
})
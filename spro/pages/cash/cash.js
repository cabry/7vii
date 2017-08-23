//logs.js
var app = getApp()
Page({
  data: {
    cash: '',
    txtArray: [],
    flagId: '',
    money:0
  },

  openContract: function () {
    wx.navigateTo({
      url: '../helpDetail/helpDetail?id=6',
    })
  },

  changeColor: function (res) {
    var txtArray = this.data.txtArray;
    for (var i = 0; i < this.data.txtArray.length; i++) {
      console.log(res.currentTarget.id);
      console.log(this.data.txtArray[i].id);
      console.log(res.currentTarget.id == this.data.txtArray[i].id);
      if (res.currentTarget.id == this.data.txtArray[i].id) {
        txtArray[i].changeColor = true;
        this.setData({
          flagId: i+1,
          money: txtArray[i].chargeMoney
        })
        console.log("ture")
      } else {
        txtArray[i].changeColor = false;
        console.log("false")
      }

    }
    this.setData({
      txtArray: txtArray
    })

  },


  refund: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '押金退款后，将在3个工作日内退回，但是您将不能继续使用Vii的服务，确认要退款吗？',
      confirmText: '押金退款',
      cancelText: '继续使用',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: that.data.servers +'wxPay/refundDeposit.do',
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
              console.log(res);
              wx.showModal({
                title: '提示',
                content: '退款申请成功，退款会在3个工作日内打回到您的原账户',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                  wx.redirectTo({
                    url: '../index/index',
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
      }
    })



  },


  charge: function () {
    console.log('开始')
    wx.showLoading({
      title: '加载中',
    })
    var that = this
      wx.request({
        url: that.data.servers +'user/commitChargeInfo.do',
        data: {
          "data": {
            "userId": this.data.userId,
            "packageId": this.data.flagId
          }
        },
        method: 'POST',
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          console.log(res);
          wx.request({
            url: that.data.servers +'wxPay/commitOrder.do',
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
                    url: that.data.servers +'user/getUserMoney.do',
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
                      that.setData({
                        cash: res.data.bizData.balance
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
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    var storeId = options.id;
    console.log(options.id);
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
          url: that.data.servers+'user/getUserMoney.do',
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
            that.setData({
              cash: res.data.bizData.balance
            })
          }
        })


      }

    })

    wx.request({
      url: that.data.servers+'common/getPackages.do',
      data: {

      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res.data.bizData);
        that.setData({
          txtArray: res.data.bizData
        });
        var txtArray = that.data.txtArray;
        for (var i = 0; i < that.data.txtArray.length; i++) {

          if (txtArray[i].giveMoney == 0) {
            txtArray[i].txt1 = that.data.txtArray[i].chargeTime + "分钟"+"\n";
          } else {
            txtArray[i].txt1 = txtArray[i].chargeTime + "分钟" + "\n"
            txtArray[i].txt2 = "送" + txtArray[i].giveTime + "分钟";
          }
        }

        //设置默认选中的状态
        txtArray[2].changeColor = true;
        var flagId = 3;
        var money = txtArray[2].chargeMoney
        that.setData({
          txtArray: txtArray,
          flagId: flagId,
          money: money
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
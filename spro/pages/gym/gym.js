var WxParse = require('../../wxParse/wxParse.js');

//logs.js
var app = getApp()
Page({
  data: {
    storeInfo: {},
    storeId: 'default',
    info: ''
  },

  order: function () {
    wx.showLoading({
      title: '加载中',
    })
    //判断是否缴纳押金
    var that = this
    wx.request({
      url: that.data.servers+'user/checkUserHasPay.do',
      data: {
        "data": {
          "userId": this.data.userId
        }
      }, method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.data.bizData.result) {
          //如果已经缴纳押金，判断当前门店是否可以进入
          wx.request({
            url: that.data.servers+'sports/checkUserCanSports.do',
            data: {
              "data": {
                "userId": that.data.userId,
                "storeId": that.data.storeId
              }
            }, method: 'POST',
            header: {
              "Content-Type": "application/json"
            },
            success: function (res) {
               if (that.data.isIllegal == 2) {
                //封号处理
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '您因为之前的违规操作，已被后台封号处理。如需帮助请联系客服',
                  showCancel: false
                })
              } else {
                wx.hideLoading();
                //如果可以进入，提示用户即将开始付费，并跳到开门页
                if (res.data.bizData.result) {
                  wx.showModal({
                    title: '提示',
                    content: '请确认您已位于门口，点击确认后门即开启并开始计费',
                    success: function (res) {
                      if (res.confirm) {
                        //开门
                        wx.request({
                          url: that.data.servers+'sports/openTheDoorV2.do',
                          data: {
                            "data": {
                              "sportsId": "0",
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
                              //跳到开门页
                              wx.reLaunch({
                                url: '../../pages/door/door?userId=' + that.data.userId + '&storeId=' + that.data.storeId + '&num=' + res.data.bizData.number + '&sportsId=' + res.data.bizData.sportsId + '&status=0'
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
                  //如果不能进入，提示用户原因
                  wx.showModal({
                    title: '提示',
                    content: '当前门店人数过多，为了保证大家都能有更好的健身体验，小v期待您换个时间再来哦',
                    showCancel: 'false'

                  })
                }
              }
              }, fail: function (res) {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '遇到了点问题，请稍后重试',
                  showCancel: false
                })
              }
          })
        } else {
          wx.hideLoading();
          //如果用户没有缴纳押金，跳到押金页面
          wx.showModal({
            title: '提示',
            content: '您还没有缴纳押金，请缴纳押金后再使用哦',
            confirmText: '缴纳押金',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../deposit/deposit'
                })
              }
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

  },

  onLoad: function (options) {
    var storeId = options.id;
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    that.setData({
      storeId: storeId
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

    wx.getStorage({
      key: 'isIllegal',
      success: function (res) {
        that.setData({
          isIllegal: res.data
        })
      }
    })
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.data.servers+'store/getSingleStoreInfo.do',
      data: {
        "data": {
          "storeId": storeId
        }
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        that.setData({
          storeInfo: res.data.bizData
        })
        var info = res.data.bizData.attentions;

        var article = res.data.bizData.attentions;
        var article2 = res.data.bizData.address;
        WxParse.wxParse('article', 'html', article, that, 5);
        WxParse.wxParse('article2', 'html', article2, that, 5);

        that.setData({
          info: info
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
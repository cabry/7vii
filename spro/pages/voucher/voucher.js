//logs.js
var app = getApp()
var util3 = require('../../utils/util3.js')
Page({
  data: {
    bannerUrl: 'http://oeeqqcyuk.bkt.clouddn.com/banner_01.jpg',
    empty1: true,
    empty2: true,
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0

  },

  addVoucher: function () {
    wx.redirectTo({
      url: '../addVoucher/addVoucher'
    })
  },

  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  onLoad: function (options) {
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    var storeId = options.id;
    console.log(options.id);

    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });

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
          url: that.data.servers + '/coupon/queryUserCoupons.do',
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
            wx.hideLoading();
            //可用
            if (res.data.bizData.availableInfos.length === 0) {
              that.setData({
                empty1: true
              })
            } else {
              that.setData({
                empty1: false
              })
              console.log(res);

              var resData1 = res.data.bizData.availableInfos;
              for (var i = 0; i < resData1.length; i++) {
                resData1[i].time = util3.formatTime(new Date(resData1[i].startTime)) + "至" + util3.formatTime(new Date(resData1[i].endTime))
              }
              that.setData({
                availableInfos: resData1
              })
            }

            //不可用
            if (res.data.bizData.unavailableInfos.length === 0) {
              that.setData({
                empty2: true
              })
            } else {
              that.setData({
                empty2: false
              })
              console.log(res);
              var resData2 = res.data.bizData.unavailableInfos;
              for (var i = 0; i < resData2.length; i++) {
                resData2[i].time = util3.formatTime(new Date(resData2[i].startTime)) + "至" + util3.formatTime(new Date(resData2[i].endTime))
              }
              that.setData({
                unavailableInfos: resData2
              })
            }

            var num = [res.data.bizData.availableInfos.length, res.data.bizData.unavailableInfos.length]
            that.setData({
              num: num
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


    //调用应用实例的方法获取全局数据

  }
})
var WxParse = require('../../wxParse/wxParse.js');

// banner.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    var id = options.id;
    console.log(id);
    wx.request({
      url: that.data.servers +'common/getBannerById.do',
      data: {
        "data": {
          "bannerId": id
        }
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res);

        var article = res.data.bizData.pageUrl;
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
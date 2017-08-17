// help.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  detail: function (res) {
    var url = '../helpDetail/helpDetail?id=' + res.currentTarget.id
    wx.navigateTo({
      url: url
    })
  },

  detailHelp: function (res) {
    var url = '../helpDetail/helpDetail?id=' + res.currentTarget.id
    wx.navigateTo({
      url: url
    })
  },

  onLoad: function (options) {
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    //获取帮助list
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.data.servers+'common/getHelpDoc.do',
      data: {

      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        var temp = res.data.bizData;
        var eqData = {};
        var helpData = {};
        var j = 0;
        var k = 0;
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].pic == '0') {
            if (temp[i].id != 6){
              helpData[j] = temp[i];
              j++;
            }
            
          } else {
            eqData[k] = temp[i];
            k++;
            
          }
        }
        that.setData({
          eqData: eqData,
          helpData: helpData
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
    //
  }
})
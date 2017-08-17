// helpDetail.js
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    temp:'',
    state:false
  },
  onLoad: function (options) {
    var id = options.id;
    var that = this;
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    var article;
    console.log(id);
    wx.request({
      url: that.data.servers+'common/getHelpDocById.do',
      data: {
        "data": {
          "equId": id
        }
      },
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res);
        var videoUrl = res.data.bizData.videoUrl;
        var state;
        if (videoUrl == 0){
          state = false;
        }else{
          state = true;
          that.setData({
            videoUrl: videoUrl
          })
        }
        that.setData({
          state: state
        })
        
        var article = res.data.bizData.detailUrl;
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    })
    
    
    
    /**
    * WxParse.wxParse(bindName , type, data, target,imagePadding)
    * 1.bindName绑定的数据名(必填)
    * 2.type可以为html或者md(必填)
    * 3.data为传入的具体数据(必填)
    * 4.target为Page对象,一般为this(必填)
    * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
    */
   
    
  }
})
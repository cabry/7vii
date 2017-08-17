//logs.js
var app = getApp()
Page({
  data: {
    rankData: [
      { userName: '王二狗', userIcon: 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEI2ffjDBrIx819mUVcZy7ibO0p8jM96fiaQ2uO8ibKMMd3gVlA2ibCPAn49VnF80ltSr2czomy1OK3CEA/0', rank: '1', totalTime:'3200'},
      { userName: '李明', userIcon: 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEI2ffjDBrIx819mUVcZy7ibO0p8jM96fiaQ2uO8ibKMMd3gVlA2ibCPAn49VnF80ltSr2czomy1OK3CEA/0', rank: '2', totalTime: '1600' },
      { userName: '张超', userIcon: 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEI2ffjDBrIx819mUVcZy7ibO0p8jM96fiaQ2uO8ibKMMd3gVlA2ibCPAn49VnF80ltSr2czomy1OK3CEA/0', rank: '3', totalTime: '580' }
      ],
      

    rankMe:{
      userName: '小闷', userIcon: 'http://wx.qlogo.cn/mmopen/PiajxSqBRaEI2ffjDBrIx819mUVcZy7ibO0p8jM96fiaQ2uO8ibKMMd3gVlA2ibCPAn49VnF80ltSr2czomy1OK3CEA/0', rank: '2', totalTime: '1600'
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
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data
        })
        wx.request({
          url: that.data.servers +'/user/getUserRank.do',
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
          }

        })
      }

    })


    

  

    
    //调用应用实例的方法获取全局数据


  }
})
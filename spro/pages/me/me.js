//logs.js
var app = getApp()
Page({
  data: {
    userInfo: {},
    userId:'',
    userData:{}
  },
  
  tabchoose: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },

  toCard:function(){
    wx.navigateToMiniProgram({
      appId: 'wxe1ef8560bf985dd7',
      path: 'pages/index/index',
      extarData: {
        open: 'happy'
      },
      envVersion: 'release',
      success(res) {
        console.log('done')
      }
    })  
  },
 
  goal:function(){
    var that =this
    wx.navigateTo({
      url: '../goal/goal?time=' + that.data.userData.totalTime,
    })
  },

 cash:function(){
   var that = this;
   wx.showLoading({
     title: '加载中',
   })
   wx.request({
     url: that.data.servers+'user/checkUserHasPay.do',
     data: {
       "data": {
         "userId": this.data.userId,
       }
     },
     method: 'POST',
     header: {
       "Content-Type": "application/json"
     },
     success: function (res) {
       wx.hideLoading();
       console.log(res.data.bizData.result)
       if (res.data.bizData.result) {
         wx.navigateTo({
           url: '../cash/cash',
         })
       }else{
         wx.navigateTo({
           url: '../deposit/deposit',
         })
       }
     },
     fail:function(err){
       wx.hideLoading();
       wx.showModal({
         title: '提示',
         content: '遇到了点问题，请稍后重试',
         showCancel: false
       })
     }
   })
 },

  onLoad: function () {
    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })
    console.log('onLoad');
      wx.getStorage({
      key: 'userId',
      success: function(res) {
      that.setData({
        userId:res.data
      })
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: that.data.servers+'user/queryUserDetailInfo.do',
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
          if(res.data.bizData.rank==0){
            res.data.bizData.rank = '--'
          }
          res.data.bizData.totalTime = Math.ceil(res.data.bizData.totalTime / 60);

          that.setData({
            userData: res.data.bizData
          })
        },
        fail:function(err){
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '遇到了点问题，请稍后重试',
            showCancel: false
          })
        }
      })
        } 
      });

      

    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
//logs.js
var app = getApp()
Page({
  data: {
    storeInfo: {},
    openId:{},
    storeId:'default'
  },

  order:function(){
    //判断是否缴纳押金
    wx.request({
      url: that.data.servers +'/user/checkUserHasPay.do',
      data: {
        "data":{
          "userId":"14"
        }
      }, method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      success: function (res) {
        console.log(res);
      }

    })

    //没有缴纳押金跳到押金页面

    //缴纳押金弹窗二次确认
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../pages/door/door?id=1'
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  
  },

  onLoad: function (options) {
    var storeId = options.id;
      wx.getStorage({
      key: 'openid',
      success: function(res) {
      that.setData({
        openId:res.data
      })
    
        } 
      });

    var that = this
    var servers = getApp().data.servsers;
    that.setData({
      servers: servers
    })

    //调用应用实例的方法获取全局数据
    
    wx.request({
      url: that.data.servers +'/store/getSingleStoreInfo.do',
        data:{
          "data":{
          "storeId": storeId
            }
          },
        method:'POST',
        header:{
           "Content-Type":"application/json"
        },
        success:function(res){
        that.setData({
          storeInfo : res.data.bizData
        })
          
        },
        fail:function(err){
            console.log(err)
        }

    })


  }
})
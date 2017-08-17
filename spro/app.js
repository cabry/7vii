//app.js
App({
  data: {
    servsers: "https://www.7vii.cn/vii/"  
  },

  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this;
    var iv, encryptedData, code;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.login({
        success: function (res) {
          code = res.code;
          wx.getUserInfo({
            success: function (res) {
              iv = res.iv;
              encryptedData = res.encryptedData;
              console.log(iv);
              console.log(encryptedData);
              wx.request({
                url: 'https://www.7vii.cn/vii/wxAuth/decodeUserInfo.do',
                data: {
                  "data": {
                    "encryptedData": encryptedData,
                    "iv": iv,
                    "code": code
                  }


                },
                method: 'POST',
                header: {
                  "Content-Type": "application/json"
                },
                success: function (res) {
                  console.log("就是这里！")
                  console.log(res);
                  wx.setStorage({
                    key: "userId",
                    data: res.data.bizData.userId
                  })
                  //
                  //res.data.bizData.isIllegal = 2
                  if (res.data.bizData.isIllegal == '1'){
                    wx.setStorage({
                      key: "isIllegal",
                      data: 1
                    })
                  } else if (res.data.bizData.isIllegal == '2'){
                    wx.setStorage({
                      key: "isIllegal",
                      data: 2
                    })
                  }

                },
                fail: function (err) {
                  console.log(err)
                }
              })
            },
            fail: function (err) {
              wx.openSetting({
                success: (res) => {
                  if (!res.authSetting["scope.userInfo"] ) {
                    wx.getUserInfo({
                      success: function (res) {
                        iv = res.iv;
                        encryptedData = res.encryptedData;
                        console.log(iv);
                        console.log(encryptedData);
                        wx.request({
                          url: 'https://www.7vii.cn/vii/wxAuth/decodeUserInfo.do',
                          data: {
                            "data": {
                              "encryptedData": encryptedData,
                              "iv": iv,
                              "code": code
                            }


                          },
                          method: 'POST',
                          header: {
                            "Content-Type": "application/json"
                          },
                          success: function (res) {
                            console.log("就是这里！")
                            console.log(res);
                            wx.setStorage({
                              key: "userId",
                              data: res.data.bizData.userId
                            })


                          },
                          fail: function (err) {
                            console.log(err)
                          }
                        })
                      }
                    })
                  }
                }
              })
            }
          })



        }
      })
    }
  },
  globalData: {
    userInfo: null,
    userId: null
  }
})
//app.js
App({
  globalData: {
    userInfo: null,
    tmpUserInfo:null
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        this.globalData.code = res.code
      
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: res=>
      {
        console.log(res)
      }

    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
   
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          console.log("try to get user info from wechat")
          wx.getUserInfo({
            success: res => {
              
             
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.tmpUserInfo = res.userInfo
          
              var app=this
              //请求后台获取openid，openid放在username里
              wx.request({
                url: 'http://118.25.23.44:8080/user/loginWeChat',
                method: "POST",
                data: {
                  nickname: this.globalData.tmpUserInfo.nickName,
                  headshot: this.globalData.tmpUserInfo.avatarUrl,
                  gender: this.globalData.tmpUserInfo.gender,
                  code: this.globalData.code
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res.data)
      
                  app.globalData.userInfo = res.data.data
                  if (app.userInfoReadyCallback) {
                    app.userInfoReadyCallback(res)
                  }
                },
                fail: function (res) {
                  console.log(res.data)
                }
              })
             
            }
          })
        }
      }
    })
   
  },
 
  
})
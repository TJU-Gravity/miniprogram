//app.js
App({
  data:{
    im: {
      sdkAppID: 1400202390, // 用户标识接入 SDK 的应用 ID，必填
      accountType: 36862, // 帐号体系集成中的 accountType，必填
      accountMode: 0, //帐号模式，0 - 独立模式 1 - 托管模式
      imId: null, // 用户的 id
      imName: null, // 用户的 im 名称
      imAvatarUrl: null, // 用户的 im 头像 url
      userSig: null // 用户通过 imId 向后台申请的签名值 sig
    }
  },
 

  globalData: {
    userInfo: null,
    tmpUserInfo: null,
    host: 'https://www.gravity.red',
    login:false
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        this.debug('getLoginCode')
        this.debug(res)
        this.globalData.code = res.code

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
      fail: res => {
        this.debug(res)
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
              this.login()
           
            }
          })
        }
      }
    })

  },
  login:function(page){
    if(this.globalData.login) return
    this.debug("尝试拉取用户详细信息")
    var app = this
    //请求后台获取openid，openid放在username里
    wx.request({
      url: app.globalData.host+'/user/loginWeChat',
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
      success: function(res) {
        console.log("app-user info")
        console.log(res.data)
        app.debug("login")
        app.debug(res.data)
        
        // im 的信息
        console.log('登陆成功记录im')
        console.log(res.data.data)
    
        app.data.im.imId = res.data.data.username;
        app.data.im.imName = res.data.data.nickname;
        app.data.im.imAvatarUrl = res.data.data.headshot;
        console.log(app.data.im)


        app.globalData.userInfo = res.data.data
        app.globalData.login = true
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback(res)
        }

      },
      fail: function(res) {
        app.debug(res)
        console.log(res.data)
      }
    })

  },

  //初始化登陆TIM的验证，要查看cbOk
  initUserSig: function (cbOk) {
    var app = this;
    var generatedSigUrl = app.globalData.host +'/generatedSig'
    var header = { "Content-Type": "application/x-www-form-urlencoded" };
    var data = { "identifier": app.data.im.imId}
    console.log('app init userSig')
    console.log(app.data.im.imId)
    wx.request({
      url: generatedSigUrl,
      header: header,
      method: "POST",
      data: data,
      success: res => {
        // 初始化 im 数据 初始化完毕再返回回调
        console.log('获取userSig并记录')
        console.log(res.data)
        app.debug('获取userSig并记录')
        app.debug(res.data)
        app.data.im.userSig = res.data.data //RestAPI 返回状态码，消息，和data
        console.log(res.data)
        cbOk()
      },
      fail:err=>{
        console.log('generateSig fail')
        console.log(err)
        app.debug('generateSig fail')
        app.debug(err)
      }
    })
  },

  debug:function(e){
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1];
    var newLog = currentPage.data.log
    if(currentPage.data.log.length>10){
      newLog.splice(0,1)
    } 
    newLog.push(JSON.stringify(e))

    currentPage.setData({
      log:newLog
    })
  }


})
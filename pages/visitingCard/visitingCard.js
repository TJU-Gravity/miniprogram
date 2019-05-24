//home.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js'); // 转换时间插件
var im = require('../../utils/webim_wx.js'); // 腾讯云 im 包
var imhandler = require('../../utils/im_handler.js'); // 这个是所有 im 事件的 js


Page({
  data: {
    isMyself:false,
    currentUser:null,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    active: 0,
    activeNames: [''],
    value: '',
  
    tags:[]
  },
  //事件处理函数
  bindViewTap: function () {
    if (this.data.isMyself)
    {
    wx.navigateTo({
     
      //url: '../logs/logs'
      url: '../info/info'
      //url: '../post/post'
    })
    }
  },
  clickContact(event)
  {

    var that = this;
    //如果已经初始化过userSig参数,直接进入一对一私聊，传入朋友的identifier，name，headshhot
    //否则先访问后台，初始化userSig参数，获取到userSig后，如果没有登陆先登陆再进入一对一私聊
    if (app.data.im.userSig) {
      //转至一对一的聊天界面(自己的openid和对方的openid)，聊天
      wx.navigateTo({
        url: '/pages/chat/chat?friendId=' + that.data.userInfo.username
          + '&friendName=' + that.data.userInfo.nickname
          + '&friendAvatarUrl=' + that.data.userInfo.headshot,
      })
    } else {

      //获取朋友用户的identifier和headshot和nickname
      //在this.data.user里

      app.initUserSig(function cbOk() {
        // 检查是否登录返回 true 和 false,不登录则重新登录
        if (im.checkLogin()) {
          //
          wx.navigateTo({
            url: '/pages/chat/chat?friendId=' + that.data.userInfo.username
              + '&friendName=' + that.data.userInfo.nickname
              + '&friendAvatarUrl=' + that.data.userInfo.headshot,
          })

        } else { //做的事情放到回调函数里
          imhandler.login(that, app, function () {
            wx.navigateTo({
              url: '/pages/chat/chat?friendId=' + that.data.userInfo.username
                + '&friendName=' + that.data.userInfo.nickname
                + '&friendAvatarUrl=' + that.data.userInfo.headshot,
            })
          });
        }
        wx.hideLoading()
      });

    }

  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
    console.log(event.detail);
  },
  onLoad: function (query) {
  
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("page me onLoad")
      console.log(this.data.hasUserInfo)
      //判断是不是自己

    
      if (query&&query.username&&query.username!=app.globalData.userInfo.username) {
        console.log("It is not me")
        this.setData
          ({
            currentUser: query.username,
            isMyself:false
          })
        var _this = this;
        console.log(this.data.currentUser)
        wx.request({
          url: 'http://118.25.23.44:8080/user/detail',
          data: {
            username: this.data.currentUser,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'//默认值
          },
          success: function (res) {
            console.log(res.data);
            _this.setData({ userInfo:res.data.data ,
              tags: res.data.data.tags});

          },
          fail: function (res) {
            console.log("加载失败");
          }
        });
        
      }
      else{
        console.log("It is me")
        this.setData
          ({
            currentUser: this.data.userInfo.username,
            isMyself:true
          })

        var _this = this;
        wx.request({
          url: 'http://118.25.23.44:8080/user/detail',
          data: {
            username: this.data.currentUser,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'//默认值
          },
          success: function (res) {
            
         //因为当前用户信息已经拥有，故只需要tags
            _this.setData({ tags: res.data.data.tags });
          },
          fail: function (res) {
            console.log("加载失败");
          }
        });

      }
    
    } 
   
  },
  goToMyList:function()
  {
    console.log("click")
    wx.navigateTo({
      url: '../me/me?username=1',
      fail: function (e){
        console.log(e)
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  navInfo: function () {
    wx.navigateTo({
      url: '../info/info'
    })
  },
  navPost: function () {
    wx.navigateTo({
      url: '../post/post'
    })
  },

})

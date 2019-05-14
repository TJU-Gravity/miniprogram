//index.js
//获取应用实例
import Toast from '../../vant-weapp/dist/toast/toast';
const app = getApp()


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    active: 0,
    // activeNames: [''],
    // value:'',
    // nickname:'',
    // location:'',
    // introduction:'',
    headshot:'',
    // email:'',
    // gender:'',
    // phone:'',
    nickName:'',
    username:'',
    headshot:''   
  },
  
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      //url: '../logs/logs'
      //url: '../info/info'
      url:'../home/home'
      //url: '../post/post'
    })
  },

  navLogIn: function () {
    Toast('请添加标签 方便他人查找');
    // console.log(app.globalData.userInfo.nickName);
    // console.log(app.globalData.userInfo.avatarUrl);
    // console.log(app.globalData.userInfo);

    wx.navigateTo({
      //url: '../logs/logs'
      //url: '../info/info'
      url: '../home/home'
      //url: '../post/post'
      
    });
    var _this = this;
    wx.request({
      url: 'http://118.25.23.44:8080/user/loginWeChat',
      data: {
        //username: app.globalData.userInfo.nickName,
        //headshot: app.globalData.userInfo.avatarUrl
        username: "1",
        headshot: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2546335362.jpg"
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res.data);
        // _this.setData({ nickname: res.data.data.nickname });
        // _this.setData({ location: res.data.data.loc });
        // _this.setData({ introduction: res.data.data.introduction });
        // _this.setData({ headshot: res.data.data.headshot });
        // _this.setData({ email: res.data.data.email });
        // if (res.data.data.gender == 1) {
        //   _this.setData({ gender: "男" });
        // } else {
        //   _this.setData({ gender: "女" });
        // }
        // _this.setData({ phone: res.data.data.phonenumber });
      },
      fail: function (res) {
        console.log("加载失败");
      }
    });
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
    //console.log(event.detail);
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
  },
  getUserInfo: function(e) {
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

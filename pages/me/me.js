//home.js
//获取应用实例
const app = getApp()

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
    //是自己 才跳转到修改信息
    if (this.data.isMyself){

      wx.navigateTo({
        //url: '../logs/logs'
        url: '../info/info'
        //url: '../post/post'
      })
    }

  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
    console.log(event.detail);
  },
  onLoad: function (query) {
   
  this.load(query)
   
  },
  load(query)
  {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      console.log("page me onLoad")
      console.log(this.data.hasUserInfo)
      //判断是不是自己
      if (query&& query.username) {
        console.log("It is not me")
        this.setData
          ({
            currentUser: query.username,
            isMyself: false
          })
        var _this = this;
        console.log(this.data.currentUser)
        wx.request({
          url: app.globalData.host+'/user/detail',
          data: {
            username: this.data.currentUser,
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'//默认值
          },
          success: function (res) {
            console.log(res.data);
            _this.setData({
              userInfo: res.data.data,
              tags: res.data.data.tags
            });

          },
          fail: function (res) {
            console.log("加载失败");
          }
        });

      }
      else {
        console.log("It is me")
        this.setData
          ({
            currentUser: this.data.userInfo.username,
            isMyself: true
          })

        var _this = this;
        wx.request({
          url: app.globalData.host+'/user/detail',
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
        console.log(this.data.userInfo);
      }

    } 
  },
  /**
     * 生命周期函数--监听页面显示
     */
  onShow: function () {
    
    if(this.data.active==1)
    {
      console.log("load again")
      this.load(null);
    }
    this.setData({
      active: 1
    })
  },
  goToMyList:function()
  {

    console.log('../myList/myList?username=' + this.data.userInfo.username);
    wx.navigateTo({
      url: '../myList/myList?username=' + this.data.userInfo.username,
    });
   
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

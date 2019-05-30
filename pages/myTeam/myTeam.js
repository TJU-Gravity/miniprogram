//myTeam.js
//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    active: 0,
    posts: {},
    abstract: [],
    teams:[],
    temp: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload")
    if (app.globalData.userInfo) {

      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {

        this.setData({
          userInfo: res.data.data,
          hasUserInfo: true
        })
      }
    }
    var _this = this;
    var i = 0;
    var summary = new Array();
    wx.request({
      url: 'http://118.25.23.44:8080/team/myList',
      data: {
        page: 1,
        size: 5,
        username:"ohNps5dNofohp2j0EuDDpFg8fxXQ"
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res.data);
        _this.setData({ teams: res.data.data.list });
        console.log(_this.data.teams)
      },
      fail: function (res) {
        console.log("加载失败");
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onChange(event) {
    console.log(event.detail);
  },
  onClickTeam: function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id);
    console.log('../teamDetail/teamDetail?teamid=' + id );
    wx.navigateTo({
      url: '../teamDetail/teamDetail?teamid=' + id,
    })
    
  }
})
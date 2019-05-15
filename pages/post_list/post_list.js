//post_list.js
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
      delBtnWidth: 120, //删除按钮宽度单位（rpx）
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
            url: 'http://118.25.23.44:8080/post/list',
            data: {
                page: 1,
                size: 20
            },
            method: 'POST',
            header: {
                'content-type': 'application/json'//默认值
            },
            success: function (res) {
                console.log(res.data);
                _this.setData({ posts: res.data.data });               
                for (i = 0; i < res.data.data.list.length; i++) {
                    summary[i] = res.data.data.list[i].postbody.substr(0, 15);
                }
                _this.setData({ abstract: summary });              
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
    onClickDetail: function (e) {
        var id = e.currentTarget.dataset.id;
        console.log('../postDetail/postDetail?id=' + id+'&username='+this.data.userInfo.username);
        wx.navigateTo({
          url: '../postDetail/postDetail?id=' + id + '&username=' + this.data.userInfo.username,
        })
    },
  onClickUser: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log('../visitingCard/visitingCard?username=' + id);
    wx.navigateTo({
      url: '../visitingCard/visitingCard?username=' + id,
    })
  },
    onClickAdd() {
      console.log(this.data.userInfo);
      wx.navigateTo({
        url: '../add_post/add_post?username='+this.data.userInfo.username,
      });
    }
})
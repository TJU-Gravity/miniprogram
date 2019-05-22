// pages/searchResult/searchResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    wx.request({
      url: 'http://118.25.23.44:8080/user/tags/findUsersByTags',
      data:{
        tags:['java','pypy'],
      },
      method: 'POST',
        header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res.data);
        _this.setData({ users: res.data.data });
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
  onClickUser: function (e) {
    var id = e.currentTarget.dataset.id;
    console.log('../visitingCard/visitingCard?username=' + id);
    wx.navigateTo({
      url: '../visitingCard/visitingCard?username=' + id,
    })
  },
})
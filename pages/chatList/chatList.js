// pages/postList/postList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: {},
    chats:[{
      time:"2018-10-10",
      nickname:"you",
      username:"you",
      body:"test",
      headshot:"http://pic.9ht.com/up/2016-12/14810057988524092.jpg"
 
    }],
    user:{},
    replyContent:'',
    option:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
  onChangeReply(event){
    this.setData({replyContent:event.detail});
    console.log(this.data.replyContent);
  },

  onClick: function (e) {
    var username = e.currentTarget.dataset.id;
    console.log(username)
    wx.navigateTo({
      url: '../chat/chat?username=' + username,
    })
  },
})
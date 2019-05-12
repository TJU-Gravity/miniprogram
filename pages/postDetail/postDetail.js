// pages/postList/postList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: {},
    replies:[],
    user:{},
    replyContent:'',
    option:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options:options});
    this.setData({replyContent:''});
    var _this=this;
    wx.request({
      url:'http://118.25.23.44:8080/post/detail',
      data:{
        ID:options.id//上一个页面传参
      },
      method:'POST',
      header:{
        'content-type':'application/json'//默认值
      },
      success:function(res){
        console.log(res.data);
        _this.setData({ post:res.data.data.post });
        _this.setData({ replies: res.data.data.replies });
        _this.setData({ user: res.data.data.user });
      },
      fail:function(res){
        console.log("加载失败");
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
  onChangeReply(event){
    this.setData({replyContent:event.detail});
    console.log(this.data.replyContent);
  },

  onClick(){
    var _this=this;
    wx.request({
      url: 'http://118.25.23.44:8080/reply/add',
      data: {
        posterid: '1',
        postid: this.data.post.postid,
        replybody: this.data.replyContent
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res);
        console.log("评论成功");
        _this.onLoad(_this.data.options);
      },
      fail: function (res) {
        console.log("评论失败");
      }
    });
  }
})
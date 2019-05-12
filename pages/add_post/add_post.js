//add_post.js
//获取应用实例
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    content:'',
    type:'1',
    value:1
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

  onClickLeft() {
    wx.showToast({ title: '点击返回', icon: 'none' });
    wx.navigateBack({
      delta: 1
    });
  },
  onClickRight() {
    wx.showToast({ title: '点击提交', icon: 'none' });
    wx.request({
      url: 'http://118.25.23.44:8080/post/add',
      data: {
        posttype:this.data.type,
        posterid:'1',
        title:this.data.title,
        postbody:this.data.content,
        state:this.data.value
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res);
        console.log("发布成功");
        wx.navigateBack({
          delta: 1
        });
      },
      fail: function (res) {
        console.log("发布失败");
      }
    });
  },
  onChangeTitle(event) {
    this.setData({ title: event.detail });
  },
  onChangeContent(event) {
    this.setData({ content: event.detail });
  },
  onChangeType(event){
    this.setData({ type:event.detail });
  },
  onChangeNum(event) {
    this.setData({ value: event.detail });
  },
})
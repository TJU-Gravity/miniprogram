// pages/teamDetail/teamDetail.js

const app = getApp();
var util = require('../../utils/util.js'); // 转换时间插件
var im = require('../../utils/webim_wx.js'); // 腾讯云 im 包
var imhandler = require('../../utils/im_handler.js'); // 这个是所有 im 事件的 js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    post: {},
    replies: [],
    user: {},
    replyContent: '',
    options: {},
    team_info: {},
    team_mem: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ options: options });
    var _this = this;
    wx.request({
      url: 'http://118.25.23.44:8080/team/detail',
      data: {
        ID: 7//上一个页面传参
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res.data);
        _this.setData({ team_info: res.data.data });
        _this.setData({ team_mem: res.data.data.members });
        console.log(_this.data.team_info);
      },
      fail: function (res) {
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
  onChangeReply(event) {
  },

  onClick() {
  },
  onPost: function(e) {
    //var id = e.currentTarget.dataset.id;
    var id = 1;
    console.log('../postDetail/postDetail?id=' + id);
    wx.navigateTo({
      url: '../postDetail/postDetail?id=' + id,
    })
  },
  onDelMember
})
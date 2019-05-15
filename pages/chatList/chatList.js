// pages/postList/postList.js


const app=getApp();
var util = require('../../utils/util.js'); // 转换时间插件
var im = require('../../utils/webim_wx.js'); // 腾讯云 im 包
var imhandler = require('../../utils/im_handler.js'); // 这个是所有 im 事件的 js

            // "friendId": item.To_Account,
            // "friendName": item.C2cNick,
            // "friendAvatarUrl": item.C2cImage,
            // "msgTime": util.getDateDiff(item.MsgTimeStamp * 1000),
            // "msg": item.MsgShow,
            // "unreadMsgCount": item.UnreadMsgCount

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
    option:{},
    isNoData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('in chatList onLoad')

    //加载动画
    wx.showLoading()

    // 会话列表所需参数初始化 需将当前会话好友数据清空
    imhandler.init({
      accountMode: app.data.im.accountMode,
      accountType: app.data.im.accountType,
      sdkAppID: app.data.im.sdkAppID,
      selType: im.SESSION_TYPE.C2C,
      imId: app.data.im.imId,
      imName: app.data.im.imName,
      imAvatarUrl: app.data.im.imAvatarUrl,
      friendId: null,
      friendName: null,
      friendAvatarUrl: null,
      contactListThat: that,
      chatThat: null
    })

    //设置Identifier,和获取UserSig
    app.initUserSig(function cbOk() {
      // 检查是否登录返回 true 和 false,不登录则重新登录
      if (im.checkLogin()) {
        that.initRecentContactList();
        // 初始化最近会话的消息未读数（监听新消息事件）
        im.syncMsgs(imhandler.onMsgNotify());
      } else {
        imhandler.login(that, app, function () {
          that.initRecentContactList();
          // 初始化最近会话的消息未读数（监听新消息事件）
          im.syncMsgs(imhandler.onMsgNotify());
        });
      }
      wx.hideLoading()
    })
  },
  initRecentContactList:function(){
    //登陆，并拉取会话列表
    im.Log.warn("开始拉取最近联系人列表");
    var that = this;
    // 真正获取会话列表的方法 count: 最近的会话数 ,最大可设置为 100 只获取有价值数据
    im.getRecentContactList({ 'Count': 10 }, function (resp) {
      if (resp.SessionItem && resp.SessionItem.length > 0) {
        var contactList = resp.SessionItem.map((item, index) => {
          return {
            "username": item.To_Account,
            "nickname": item.C2cNick,
            "headshot": item.C2cImage,
            "time": util.getDateDiff(item.MsgTimeStamp * 1000),
            "body": item.MsgShow
          }
        })
        console.log('拉取到的会话列表')
        console.log(contactList)
        // 设置联系人列表
        that.setData({
          chats: contactList,
          isNoData: true
        })
      } else {
        that.setData({
          isNoData: false,
        })
      }
    })
    im.Log.warn("成功拉取最近联系人列表");
   
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
      url: '../chat2/chat?username=' + username,
    })
  },
})
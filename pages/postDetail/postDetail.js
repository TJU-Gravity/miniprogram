
// pages/postList/postList.js
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
    replies:[],
    user:{},
    team:{},
    replyContent:'',
    options:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({options:options});
    this.setData({replyContent:""});
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
        res.data.data.post.nickname = res.data.data.user.nickname;
        _this.setData({ 
          post:res.data.data.post,
          replies: res.data.data.replies ,
          user: res.data.data.user        
         });
        if (res.data.data.post.posttype=='1'){
          wx.request({
            url: 'http://118.25.23.44:8080/team/detail',
            data: {
              ID: res.data.data.post.teamid
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'//默认值
            },
            success: function (res) {
              console.log(res.data);
              _this.setData({
                team: res.data.data
              });
            },
            fail: function (res) {
              console.log("加载失败");
            }
          });
        }       
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
        posterid: this.data.options.username,
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
        wx.showToast({ title: '评论成功', icon: 'none' });
        _this.onLoad(_this.data.options);
      },
      fail: function (res) {
        console.log("评论失败");
        wx.showToast({ title: '评论失败', icon: 'none' });
      }
    });
  },
  onJoin(){
    //console.log('申请加入')

    var that = this;
    var i=0;
    var inteam=false;
    for (i=0;i<this.data.team.members.length;i++){
      if (this.data.team.members[i].username==this.data.options.username){
        console.log("???????");
        inteam=true;
        break;
      }
    }
    if (inteam){
      wx.showToast({ title: '您已在团队中', icon: 'none' });
    }
    else{
      wx.request({
        url: 'http://118.25.23.44:8080/apply/add',
        data:{
          username:this.data.options.username,
          captainid:this.data.post.posterid,
          teamid:this.data.post.teamid,
          state:this.data.post.state
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'//默认值
        },
        success: function (res) {
          console.log(res);
          if (res.data.code==200)
            wx.showToast({ title: '已发送申请，正在跳转到聊天页面', icon: 'none' });
          else if (res.data.code == 400)
            wx.showToast({ title: '双方有申请正在进行中', icon: 'none' });
        },
        fail: function (res) {
          console.log("申请失败");
          wx.showToast({ title: '申请失败', icon: 'none' });
        }
      });

      //如果已经初始化过userSig参数,直接进入一对一私聊，传入朋友的identifier，name，headshhot
      //否则先访问后台，初始化userSig参数，获取到userSig后，如果没有登陆先登陆再进入一对一私聊
      if (app.data.im.userSig){
        //转至一对一的聊天界面(自己的openid和对方的openid)，聊天
        wx.navigateTo({
          url: '/pages/chat/chat?friendId=' + that.data.user.username
            + '&friendName=' + that.data.user.nickname
            + '&friendAvatarUrl=' + that.data.user.headshot,
        })
      }else{
        
        //获取朋友用户的identifier和headshot和nickname
        //在this.data.user里
        
        app.initUserSig(function cbOk() {
          // 检查是否登录返回 true 和 false,不登录则重新登录
          if (im.checkLogin()) {
            //
            wx.navigateTo({
              url: '/pages/chat/chat?friendId=' + that.data.user.username
                + '&friendName=' + that.data.user.nickname
                + '&friendAvatarUrl=' + that.data.user.headshot,
            })
          
          } else { //做的事情放到回调函数里
            imhandler.login(that, app, function () {
              wx.navigateTo({
                url: '/pages/chat/chat?friendId=' + that.data.user.username
                  + '&friendName=' + that.data.user.nickname
                  + '&friendAvatarUrl=' + that.data.user.headshot,
              })
            });
          }
          wx.hideLoading()
        });

      }
    }
  }

})
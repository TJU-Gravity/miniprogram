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
    log:[],
    post: {},
    chats: [{}],
    user: {},
    replyContent: '',
    option: {},
    clickUser: {},
    isNoData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    //加载动画
    wx.showLoading()
    if (app.globalData.userInfo) {
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
     //判断有没有Identifier,和获取UserSig,login,initRecentContactList放到了onShow
      wx.hideLoading()

    } else if (this.data.canIUse) {
      //console.log("delay")
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
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
        //判断有没有Identifier,和获取UserSig,login,initRecentContactList放到了onShow
        wx.hideLoading()
      }
    }
    console.log("聊天列表onLoad结束")
  
  },
  initRecentContactList: function() {
    //登陆，并拉取会话列表
    im.Log.warn("开始拉取最近联系人列表");
    var that = this;
    // 真正获取会话列表的方法 count: 最近的会话数 ,最大可设置为 100 只获取有价值数据
    im.getRecentContactList({
      'Count': 10
    }, function(resp) {
      if (resp.SessionItem && resp.SessionItem.length > 0) {
        console.log("resp.SessionItem")
        console.log(resp.SessionItem)
        app.debug("recentContact")
        app.debug(resp.SessionItem)
        var contactInfo = {}
        for(var i = 0;i<resp.SessionItem.length;i++){
          contactInfo[resp.SessionItem[i].To_Account] ={
            "time": util.getDateDiff(resp.SessionItem[i].MsgTimeStamp * 1000),
            "body": resp.SessionItem[i].MsgShow
          }
        }
       
        var usernames = resp.SessionItem.map((item, index) => {
          return item.To_Account
        })
        console.log('拉取到的会话列表')
        console.log(contactInfo)
        that.getUserList(usernames,contactInfo)

        
      
       
      } else {
        that.setData({
          isNoData: true,
          finishLoading:true
        })
      }
    })
    im.Log.warn("成功拉取最近联系人列表");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    imhandler.selSess = null;
    var that = this;
    //加载动画
    wx.showLoading()
    if (!app.data.im.userSig) {
      console.log('聊天列表初始化userSig')
      app.debug('聊天列表初始化userSig')
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
    } else {
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
      wx.hideLoading();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onChangeReply(event) {
    this.setData({
      replyContent: event.detail
    });
    console.log(this.data.replyContent);
  },

  onClick: function(e) {
      var that = this;
      //获取对方用户的id,name,头像
      var username = e.currentTarget.dataset.id;

      //获取userSig登陆进入详情页，或者直接进入聊天详情页
      wx.request({
        url: app.globalData.host+'/user/detail',
        method: 'POST',
        data: {
          username: username
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var clickUser = res.data.data
          //如果已经初始化过userSig参数,直接进入一对一私聊，传入朋友的identifier，name，headshhot
          //否则先访问后台，初始化userSig参数，获取到userSig后，如果没有登陆先登陆再进入一对一私聊
          if (app.data.im.userSig) {
            //转至一对一的聊天界面(自己的openid和对方的openid)，聊天
            wx.navigateTo({
              url: '/pages/chat/chat?friendId=' + clickUser.username +
                '&friendName=' + clickUser.nickname +
                '&friendAvatarUrl=' + clickUser.headshot,
            })
          } else {

            //获取朋友用户的identifier和headshot和nickname
            //在this.data.user里

            app.initUserSig(function cbOk() {
              // 检查是否登录返回 true 和 false,不登录则重新登录
              if (im.checkLogin()) {

                wx.navigateTo({
                  url: '/pages/chat/chat?friendId=' + clickUser.username +
                    '&friendName=' + clickUser.nickname +
                    '&friendAvatarUrl=' + clickUser.headshot,
                })

              } else { //做的事情放到回调函数里
                imhandler.login(that, app, function () {
                  wx.navigateTo({
                    url: '/pages/chat/chat?friendId=' + clickUser.username +
                      '&friendName=' + clickUser.nickname +
                      '&friendAvatarUrl=' + clickUser.headshot,
                  })
                });
              }
              wx.hideLoading()
            });

          }
        },
        fail: function (res) {
          console.log(res.data)
        }
      });
  },

  //使用bindlongpress，与bindtap不冲突，实现长按删除
  bindLongTap: function (e) {
    console.log("长按");
    var that = this;
    var id = e.currentTarget.dataset.id;
    //只有删除选项，简单起见用模态框进行操作
    wx.showModal({
      title: '提示',
      content: '确定要删除此聊天会话吗？',
      success: function (res) {
        //成功回调，是指用户点击了confirm或cancel后执行相应处理
        //点击了确定
        if (res.confirm) {
          console.log('点击确定了');
          var options = {
            'To_Account': id,
            'chatType': 1
          }
          var chats = that.data.chats;  
          im.deleteChat(options,
            function (resp) {
              var len = chats.length
              for (var i = 0; i < len;i++){
                console.log(chats[i])
                console.log(id)
                console.log(chats[i].username==id)
                if (chats[i].username == id){
                  console.log("jjj")
                  chats.splice(i, 1);
                  console.log(chats);   
                }
              }
              that.setData({
                chats:chats
              })
              console.log("chats")
              console.log(chats)
          });
        //点击了取消
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },

  getUserList:function(usernames,contactInfo){
    if(usernames==null||usernames==[]){
      this.setData({
        finishLoading: true
      })
    }
    var that = this
    wx.request({
      url: app.globalData.host+'/user/getUsers',
      data: usernames,
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res);
        
        console.log(contactInfo[res.data.data[0].username]);
        var contactList = res.data.data.map((item, index) => {
          return {
            "username": item.username,
            "nickname": item.nickname,
            "headshot": item.headshot,
            "time": contactInfo[item.username].time,
            "body": contactInfo[item.username].body
          }
          
        })
        console.log(contactList)
        app.debug("联系人列表加载完成")
        app.debug(contactList)
         // 设置联系人列表
         that.setData({
          chats: contactList,
          finishLoading: true
        })
      },
      fail: function (res) {
        console.log("发布失败");
      }
    });
  }
})
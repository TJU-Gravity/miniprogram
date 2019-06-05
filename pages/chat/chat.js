// pages/chat/chat.js



const app = getApp();
var inputVal = '';
var msgList = [];
var windowWidth = wx.getSystemInfoSync().windowWidth;
var windowHeight = wx.getSystemInfoSync().windowHeight;
var keyHeight = 0;



var util = require('../../utils/util.js'); // 转换时间插件
var im = require('../../utils/webim_wx.js'); // 腾讯云 im 包
var imhandler = require('../../utils/im_handler.js'); // 这个是所有 im 事件的 js



/**
 * 初始化数据,
 * TODO//检查用户登录TIM状态，先登录，然后拉取两者的历史信息
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedTeam:null,
    selectedTeamName:'',
    show: false,
    actions: [
      {
        loading: true
      },
     
      {
        name: '',
        disabled: true
      },
     
      {
        name: '',
        disabled: true
      }
    ],
    youId:'',
    youName:'',
    apply:null,
    meHeadIcon:null,
    youHeadIcon:"http://pic.9ht.com/up/2016-12/14810057988524092.jpg",
    scrollHeight: '100vh',
    inputVal:"",
    inputBottom: 0,
    msgList:[],
    lock:false
  },

  
  onLoad: function (options) {
    console.log("来聊天呀~")
    console.log(options)
    var that = this
   
    if (options) { // 设置会话列表传参过来的好友id
    
      that.setData({
        youId: options.friendId,
        youName: options.friendName,
        youHeadIcon: options.friendAvatarUrl,
        meHeadIcon: app.data.im.imAvatarUrl
      })
      //前端加一个导航栏
      wx.setNavigationBarTitle({
        title: options.friendName
      })
    }

    that.data.msgList = [] // 清空历史消息
  
    wx.request({
      url: 'http://118.25.23.44:8080/apply/check',
      data: [this.data.youId,app.globalData.userInfo.username],
      method:'POST',
       success: function (res) {
         console.log(res)
         if ( res.data.data)
         {that.setData({apply:{teamName:res.data.data.teamname,
           teamid:res.data.data.teamid,
           applicant: res.data.data.username,
           nickname: (res.data.data.username===that.data.youId?that.data.youName:"你")}});
         }
         
       }
    })
  },
  //app.js里面加上data和获取函数
  onShow: function () {
    var that = this
   
    // 私聊参数初始化
    imhandler.init({
      accountMode: app.data.im.accountMode,
      accountType: app.data.im.accountType,
      sdkAppID: app.data.im.sdkappid,
      selType: im.SESSION_TYPE.C2C, //私聊
      imId: app.data.im.identifier,
      imName: app.data.im.imName,
      imAvatarUrl: app.data.im.imAvatarUrl,
      friendId: that.data.youId,
      friendName: that.data.youName,
      friendAvatarUrl: that.data.youHeadIcon,
      contactListThat: null,
      chatThat: that
    })
    console.log("onshow 参数初始化")
    console.log("onshow 参数初始化")
    console.log("onshow 参数初始化")
    console.log("onshow 参数初始化")
   
    console.log(that.data.youId)
    console.log(that.data.youName)
    console.log(that.data.youHeadIcon)
    
    if (im.checkLogin()) {
      //获取聊天历史记录
      imhandler.getC2CHistoryMsgs(function cbOk(result) {
        that.handlerHistoryMsgs(result, that)
      })
    } else {
      imhandler.sdkLogin(that, app, this.data.selToID, () => {
        //获取聊天历史记录
        imhandler.getC2CHistoryMsgs(function cbOk(result) {
          that.handlerHistoryMsgs(result, that)
        });
      });
    }
  },

/**
 * cbok显示onShow里获取历史消息
 */
  handlerHistoryMsgs: function (result, that) {
    console.log('chat')
    var historyMsgs = [];
    for (var i = 0; i < result.MsgList.length; i++) {
      var msg = result.MsgList[i]
     
      var message = {
        'speaker': msg.isSend ? 'me' : 'you',
        'contentType': 'text',
        'content': msg.elems[0].content.text
      }
      historyMsgs.push(message)
    }
    
 
    that.setData({
      msgList: historyMsgs,
      complete: result.Complete
    })
  },

  
  /**
   * 获取聚焦
   */
  focus: function (e) {
    keyHeight = e.detail.height;
    this.setData({
      scrollHeight: (windowHeight - keyHeight) + 'px'
    });
    this.setData({
      toView: 'msg-' + (msgList.length - 1),
      inputBottom: keyHeight + 'px'
    })
  },

  //失去聚焦(软键盘消失)
  blur: function (e) {
    this.setData({
      scrollHeight: '100vh',
      inputBottom: 0
    })
    this.setData({
      toView: 'msg-' + (msgList.length - 1)
    })
  },




  /**
   * 发送消息
   */
  sendClick: function (e) {

    //debugger
    var that = this
    // 消息锁 锁定中
    if (that.data.lock) {
      wx.showToast({
        title: '发消息太急了，慢一点'
      });
      return
    }
    // 开始加锁
    that.setData({ lock: true })
    that.setData({
      inputVal:e.detail.value
    })
    console.log(that.data.inputVal)
    if (that.data.inputVal == '' || !that.data.inputVal.replace(/^\s*|\s*$/g, '')) {
      wx.showToast({
        title: '总得填点内容吧'
      });
      this.setData({ lock: false })
      return;
    }
    var content = that.data.inputVal
    // 调用腾讯IM发送消息
    imhandler.onSendMsg(content, function cbOk() {
      that.addMessage(content, true, that)
    }, function cbErr(err) {
      im.Log.error("消息发送失败", err)
    })
    // 解锁
    this.setData({ lock: false })
  },

  /**
   * 发送消息
   */
  addMessage: function (msg, isSend, that) {
    var msgList = that.data.msgList;
    var message = {
      'speaker': isSend ? 'me' : 'you',
      'contentType': "text",
      'content': msg
    }
    msgList.push(message);
    that.setData({
      msgList: msgList,
      inputVal: '' // 清空输入框文本
    })
    that.scrollToBottom();
  },
  scrollToBottom: function () {
    this.setData({
      toView: 'row_' + (this.data.msgList.length - 1)
    });
  },

   

  
  
 

  
  /**
   * 退回上一页
   */
  toBackClick: function () {
    //wx.navigateBack({})
    wx.navigateTo({
      url: "../chatList/chatList"
    })
  },

  cancel: function () {
    var that = this;
    //lyx推送一下？
    that.setData({ lock: true })
    // console.log(that.data.youName) 
    var content = "NOTE: " + app.data.im.imName + " 已撤销加入 " + that.data.youName+" 的队伍。"
    imhandler.onSendMsg(content, function cbOk() {
      that.addMessage(content, true, that)
    }, function cbErr(err) {
      im.Log.error("消息发送失败", err)
    })
    // 解锁
    that.setData({ lock: false })
   
    wx.request({
      url: 'http://118.25.23.44:8080/apply/delete',
      data: [this.data.youId, app.globalData.userInfo.username],
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({apply:null})
      }
    })
  },
  reject: function () {
   // lyx推送一下？
    var that = this;
    that.setData({ lock: true })
    // console.log(that.data.youName) 
    var content = "NOTE: " + app.data.im.imName + " 已拒绝加入 " + that.data.youName + " 的队伍。"
    imhandler.onSendMsg(content, function cbOk() {
      that.addMessage(content, true, that)
    }, function cbErr(err) {
      im.Log.error("消息发送失败", err)
    })
    // 解锁
    that.setData({ lock: false })


    wx.request({
      url: 'http://118.25.23.44:8080/apply/delete',
      data: [this.data.youId, app.globalData.userInfo.username],
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({ apply: null })
      }
    })
  },
  accept: function () {
    //lyx推送一下？

    var that = this;
    that.setData({ lock: true })
    // console.log(that.data.youName) 
    var content = "NOTE: " + app.data.im.imName + " 已接收加入 " + that.data.youName + " 的队伍。"
    imhandler.onSendMsg(content, function cbOk() {
      that.addMessage(content, true, that)
    }, function cbErr(err) {
      im.Log.error("消息发送失败", err)
    })
    // 解锁
    that.setData({ lock: false })


    wx.request({
      url: 'http://118.25.23.44:8080/user/team/delete',
      data: {
        teamid:that.data.apply.teamid,
        username: that.data.apply.applicant
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({ apply: null })
      }
    })
  },
  onOpen() {
    var that=this;
    console.log("open")
    this.setData({
      show: true, 
      actions: [
       
        {
          loading: true
        },

        {
          name: '',
          disabled: true
        },

        {
          name: '',
          disabled: true
        }
      ] });
    var username = app.globalData.userInfo.username;
    wx.request({
      url: 'http://118.25.23.44:8080/team/myList',
      data: {
        username: username
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var list=res.data.data.list;
        var myList=[];
        for(var i=0;i!=list.length;i++)
        {
          if(list[i].captainid===username)
          {
            console.log("my team")
            console.log(list[i].captainid)
            myList.push({
              name:list[i].team_name,
              teamid:list[i].teamid})
          }
        }
        myList.push({
          name: '',
          disabled: true
        })
        myList.push({
          name: '',
          disabled: true
        })
        console.log(myList)
        that.setData({
          show: true,
          actions: myList
        });
       
      }
    })

  },
onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail);
    this.setData({
      selectedTeam: event.detail.teamid,
      selectedTeamName:event.detail.name
    })

  },
  invite()
  {
    var captainid=app.globalData.userInfo.username;
    var username=this.data.youId;
    var teamid=this.data.selectedTeam;
    wx.request({
      url: 'http://118.25.23.44:8080/apply/add',
      data: {
        username: username,
        captainid: captainid,
        teamid: teamid,
        type: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 200)
          wx.showToast({ title: '已发送邀请', icon: 'none' });
        else if (res.data.code == 400)
          wx.showToast({ title: '双方有申请正在进行中', icon: 'none' });
      },
      fail: function (res) {
        console.log("邀请失败");
        wx.showToast({ title: '邀请失败', icon: 'none' });
      }
    });
  }
})






// Page({
//   data: {
//     friendId: '',
//     friendName: '',
//     friendAvatarUrl: '',
//     /**
//      * 消息集合（结构如下）：
//      * msgTime 消息时间
//      * myself 消息发送人 1 - 自己发的 0 - 好友发的
//      * avatarUrl 头像
//      * msgText 消息内容
//      */
//     msgList: [],// 消息集合
//     complete: 0, // 是否还有历史消息可以拉取，1 - 表示没有，0 - 表示有
//     content: '', // 输入框的文本值
//     lock: false, // 发送消息锁 true - 加锁状态 false - 解锁状态
//     scroll_height: wx.getSystemInfoSync().windowHeight - 54,
//   },
  
 
//   /**
//    * 获取文本的消息
//    */
//   getContent: function (e) {
//     var that = this;
//     that.setData({
//       content: e.detail.value
//     })
//   },
  
// })

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
    scrollHeight: '70vh',
    inputVal:"",
    inputBottom: 0,
    msgList:[],
    lock:false
  },

  
  onLoad: function (options) {
    console.log("来聊天呀~")
    
    var that = this
    console.log(options)
    if (options) { // 设置会话列表传参过来的好友id
      console.log(options)
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
      url: app.globalData.host+'/apply/check',
      data: [this.data.youId,app.globalData.userInfo.username],
      method:'POST',
       success: function (res) {
         console.log(res)
         if ( res.data.data)
         
         {that.setData({apply:{
           type: res.data.data.type,
           teamName:res.data.data.teamname,
           teamid:res.data.data.teamid,
           applicant: res.data.data.username,
           nickname: (res.data.data.username===that.data.youId?that.data.youName:"你")}});
         }
         
       }
    })
    this.onShow()
  },
  //app.js里面加上data和获取函数
  onShow: function () {
    var that = this
    console.log("identifier")
   console.log(app.data.im)
    // 私聊参数初始化
    imhandler.init({
      accountMode: app.data.im.accountMode,
      accountType: app.data.im.accountType,
      sdkAppID: app.data.im.sdkappid,
      selType: im.SESSION_TYPE.C2C, //私聊
      imId: app.data.im.imId,
      imName: app.data.im.imName,
      imAvatarUrl: app.data.im.imAvatarUrl,
      friendId: that.data.youId,
      friendName: that.data.youName,
      friendAvatarUrl: that.data.youHeadIcon,
      contactListThat: null,
      chatThat: that
    })
    console.log({
      accountMode: app.data.im.accountMode,
      accountType: app.data.im.accountType,
      sdkAppID: app.data.im.sdkappid,
      selType: im.SESSION_TYPE.C2C, //私聊
      imId: app.data.im.id,
      imName: app.data.im.imName,
      imAvatarUrl: app.data.im.imAvatarUrl,
      friendId: that.data.youId,
      friendName: that.data.youName,
      friendAvatarUrl: that.data.youHeadIcon,
      contactListThat: null,
      chatThat: that
    })
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

      if (msg.elems[0].content.text.substr(0, 5) === 'NOTE:')
        msg.elems[0].content.text = msg.elems[0].content.text.substr(6, msg.elems[0].content.text.length)
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
    this.scrollToBottom()
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
      scrollHeight: '70vh',
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
    console.log(msg)
    if (msg.substr(0, 5) === 'NOTE:')
    {
      msg = msg.substr(6, msg.length)
      this.onLoad()
    }
    var message = {
      'speaker': isSend ? 'me' : 'you',
      'contentType': "text",
      'content': msg
    }
  
    //消息列表加入消息
    msgList.push(message);
    //绑定数据，清空输入框
    that.setData({
      msgList: msgList,
      inputVal: '' // 清空输入框文本
    })
    //滚动到聊天底部
    that.scrollToBottom();
  },
  scrollToBottom: function () {
    console.log('滚动到底部'+'msg-' + (this.data.msgList.length - 1))
    console.log(this.data.msgList[this.data.msgList.length - 1])
    this.setData({
      toView: 'msg-' + (this.data.msgList.length - 1)
    });
  },

   

  
  
 

  
  /**
   * 退回上一页
   */
  

  cancel: function () {
    var that = this;
    //lyx推送一下？
    that.setData({ lock: true })
    if(this.data.apply.type!=1){
      // console.log(that.data.youName) 
      var content = "NOTE: " + app.data.im.imName + " 已撤销加入 " + that.data.youName + " 的队伍 "+ that.data.apply.teamName
     
    }else{
      var content = "NOTE: " + app.data.im.imName + " 已撤销邀请 " + that.data.youName + " 加入 " + this.data.apply.teamName
    }
    imhandler.onSendMsg(content, function cbOk() {
      that.addMessage(content, true, that)
    }, function cbErr(err) {
      im.Log.error("消息发送失败", err)
    })
    // 解锁
    that.setData({ lock: false })
    var that = this;
    wx.request({
      
      url: app.globalData.host+'/apply/delete',
      data: [this.data.youId, app.globalData.userInfo.username],
      method: 'POST',
      success: function (res) {
     
        console.log(res)
        that.setData({apply:null})
        that.onLoad()
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
      url: app.globalData.host+'/apply/delete',
      data: [this.data.youId, app.globalData.userInfo.username],
      method: 'POST',
      success: function (res) {
     
        console.log(res)
        that.setData({ apply: null })
        that.onLoad();
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
      url: app.globalData.host+'/user/team/add',
      data: {
        teamid:that.data.apply.teamid,
        username: that.data.apply.applicant
      },
      method: 'POST',
      success: function (res) {
      
        console.log(res)
        that.setData({ apply: null })
        that.onLoad();
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
      url: app.globalData.host+'/team/myList',
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
    console.log("")
    console.log(event.detail);
    this.onClose()
    this.setData({
     
      selectedTeam: event.detail.teamid,
      selectedTeamName:event.detail.name
    })

  },
  invite()
  {
    if (this.data.selectedTeam == null){
      wx.showToast({
        title: '未选择团队',
        icon:'none'
      })
    }
    var captainid=app.globalData.userInfo.username;
    var username=this.data.youId;
    var teamid=this.data.selectedTeam;
    var that=this;
    wx.request({
      url: app.globalData.host+'/apply/add',
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
          wx.showToast({ title: res.data.message, icon: 'none' });
        that.onLoad()
      },
      fail: function (res) {
        console.log("邀请失败");
        wx.showToast({ title: '邀请失败', icon: 'none' });
      }
    });
  }
})





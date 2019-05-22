// pages/chat/chat.js

const app = getApp();


/**
 * 初始化数据
 */



Page({

  /**
   * 页面的初始数据
   */
  data: {
    clicked:false,
    chatContent:'',
    meHeadIcon:null,
    scrollTop:0,
    msgList:[],
    youHeadIcon:"http://pic.9ht.com/up/2016-12/14810057988524092.jpg",
    scrollHeight: '100vh',
    inputBottom: 0
  },

  initData() {
    
   this.setData({
      msgList: [{
        speaker: 'you',
        contentType: 'text',
        content: '你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！'
      },
      {
        speaker: 'me',
        contentType: 'text',
        content: '再见你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！你好！'
      }
      ],
      inputVal:''
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload")
    if (app.globalData.userInfo) {

      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true,
         meHeadIcon: app.globalData.userInfo.headshot
      })
    } else if (this.data.canIUse) {
      console.log("delay")
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.initData();
        this.setData({
          userInfo: res.data.data,
          meHeadIcon: res.dat.data.headshot,
          hasUserInfo: true
        })
      }
    } 
    this.initData();
    if (app.globalData.userInfo) {
 
    this.setData({
      meHeadIcon: app.globalData.userInfo.headshot,
    });
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 获取聚焦
   */
  

  /**
   * 发送点击监听
   */
  
  /**
   * 退回上一页
   */
  toBackClick: function () {
    wx.navigateBack({})
  },

  
  onChangeChat(event) {
    console.log(event);
    console.log(this.data.chatContent)
    console.log(event.detail)

    if (!this.data.clicked)
    {
      this.setData({ chatContent: event.detail });
    }
    else
    {
      this.setData({ clicked: false, 
      chatContent: "" });
      
    }

  },

  onClick(event) {
    this.setData({ clicked: true });
    console.log(event);
    var _msgList = this.data.msgList
    _msgList.push({
      speaker: 'me',
      contentType: 'text',
      content: this.data.chatContent
    })
    this.setData({
      msgList: _msgList
    });
 
    this.setData({ chatContent: "",
    scrollTop:1000 });
   
  }
  
})

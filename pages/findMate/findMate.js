// pages/findMate/findMate.js
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    active: 0,
    activeNames: [''],
    nickname: '',
    username: '',
    password: '',
    tags: [],
    next: '',
    gen: '',
    new_add: '',
  },
  //事件处理函数
  onTypeTag(event) {
    console.log(event.detail);
    console.log(event);
    var new_tag = new Array();
    var id = event.currentTarget.dataset.id;
    new_tag = this.data.tags;
    new_tag[id] = event.detail;
    this.setData({ tags: new_tag });
  },
  //输入新标签
  onTypeAdd(event) {
    console.log(event.detail);
    console.log(event);
    this.setData({ new_add: event.detail });
    //new_add = event.detail;
    console.log(this.data.new_add);
    // var new_tag = new Array();
    // var end = this.data.tags.length;
    // new_tag = this.data.tags;
    // new_tag[end] = event.detail;
    //this.setData({ tags: new_tag });
  },
  //添加所输入的新标签
  onAddTag(event) {
    var new_tag = new Array();
    new_tag = this.data.tags;
    console.log(new_tag)
    new_tag.push(this.data.new_add);
    console.log(new_tag)
    this.setData({ tags: new_tag });
  },
  onDelTag(event) {
    console.log(event.detail);
    console.log(event);
    var id = event.currentTarget.dataset.id;
    var end = this.data.tags.length;
    var new_tag = new Array();
    for (var i = 0; i < id; i++) {
      new_tag[i] = this.data.tags[i]
    }
    for (var i = id; i < end - 1; i++) {
      new_tag[i] = this.data.tags[i + 1]
    }
    console.log(new_tag);
    this.setData({ tags: new_tag });
  },
  

  onClick() {
    console.log(this.data.tags)
    var tags = JSON.stringify(this.data.tags);
    wx.navigateTo({
      url: '../searchResult/searchResult?tags=' + tags,
    })
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
    //console.log(event.detail);
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

// pages/findMate/findMate.js
const app = getApp()

Page({
  data: {
    selectedTag:false,
    currentTagList: [
  ],

    userInfo: {},
    hasUserInfo: false,
 
    nickname: '',
    username: '',
    password: '',
    tag:'',

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
 

  

  onClick() {
    console.log(this.data.tags)
    var tags = JSON.stringify(this.data.currentTagList);
    wx.navigateTo({
      url: '../searchResult/searchResult?tags=' + tags,
    })
    this.setData({ tags: [] });
    //this.onLoad();
    //this.setData({ new_add: [] });
  },
  onChange(event) {
    this.setData({
      tag: event.detail
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
  onShow:function(){
    this.setData({tags:[]});
    console.log(this.data.tags);
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  removeTag: function (options) {
    console.log(options)
    this.data.currentTagList.splice(options.currentTarget.dataset.id, 1)
    var selected = true;
    if(this.data.currentTagList.length==0) {selected = false}
    this.setData({
      currentTagList: this.data.currentTagList,
      selectedTag : selected
    })
  },
  addTag:function(options){
    if(this.data.tag=='') return
    if(this.data.currentTagList.length>=5) {
      wx.showToast({
        icon:'none',
        title: '最多只能添加5个标签'
      })
    }
    
    if(this.data.currentTagList.find(element => element == this.data.tag)) {
      wx.showToast({
        icon:'none',
        title: '不能添加相同标签'
      })
    }
    var tagList = this.data.currentTagList
    tagList.push(this.data.tag)
    var selected = false;
    if(tagList.length>0) {selected = true}
    this.setData({
      tag:'',
      currentTagList : tagList,
      selectedTag : selected
    })
    

  }
})

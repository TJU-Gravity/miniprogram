//info.js
//获取应用实例
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
    location: '',
    introduction: '',
    headshot: '',
    email: '',
    gender: '',
    phone: '',
    username:'',
    password:'',
    tags: [],
    next:'',
    //tags:''
    gen:'',
    new_add:'',   
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
      //url: '../info/info'
    })
  },
  onTypeTag(event) {
    console.log(event.detail);
    console.log(event);
    var new_tag=new Array();
    var id=event.currentTarget.dataset.id;
    new_tag=this.data.tags;
    new_tag[id]=event.detail;
    this.setData({ tags:new_tag });
  },
  onTypeAdd(event) {
    console.log(event.detail);
    console.log(event);
    this.setData({ new_add: event.detail});
    //new_add = event.detail;
    console.log(this.data.new_add);
    // var new_tag = new Array();
    // var end = this.data.tags.length;
    // new_tag = this.data.tags;
    // new_tag[end] = event.detail;
    //this.setData({ tags: new_tag });
  },
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
    for(var i = 0; i < id; i++){
      new_tag[i] = this.data.tags[i]
    }
    for (var i = id; i < end - 1; i++) {
      new_tag[i] = this.data.tags[i+1]
    }
    console.log(new_tag);
    this.setData({ tags: new_tag });
  },

  onTypeLocation(event) {
    console.log(event.detail);
    this.setData({ location: event.detail });
  },
  onTypeGender(event) {
    console.log(event.detail);
    this.setData({ gender: event.detail });
  
  },
  onTypeEmail(event) {
    console.log(event.detail);
    this.setData({ email: event.detail });
  },
  onTypePhone(event) {
    console.log(event.detail);
    this.setData({ phone: event.detail });
  },
  onTypeIntroduction(event) {
    console.log(event.detail);
    this.setData({ introduction: event.detail });
  },
  onTypePassword(event) {
    console.log(event.detail);
    this.setData({ pwd: event.detail });
  },

  onClick() {
    var _this = this;
    
    console.log(this.data.username);
    console.log(this.data.location);
    console.log(this.data.email);
    console.log(this.data.phone);
    console.log(this.data.introduction);
    console.log(this.data.password);
    //console.log(this.data.gender);
    console.log(this.data.gen);
    console.log(this.data.tags)

    if (this.data.gender == "男") {
      this.setData({ gen: '1' });
    } else {
      if (this.data.gender == "女")
      {
        this.setData({ gen: '2' });
      }
      else 
      {//未知
        this.setData({ gen: '0' });
      }
    }
    //console.log(this.data.gen);
    wx.request({
      url: 'http://118.25.23.44:8080/user/tags/ChangeUserTags',
      data: {
        username: "1",
        tags: this.data.tags
        //tags: ["a", "c"]
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res);

      },
      fail: function (res) {
        console.log("加载失败");
      }
    });
    wx.request({
      url: 'http://118.25.23.44:8080/user/update',
      data: {
        username: this.data.userInfo.username,
        loc: this.data.location,
        gender: this.data.gen,
        email: this.data.email,
        phonenumber: this.data.phone,
        introduction: this.data.introduction
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res);
<<<<<<< HEAD
        wx.navigateBack({
          delta:1
        });
=======
        app.globalData.userInfo=res.data.data
        
wx.navigateBack({
  delta: 1,
})
>>>>>>> fbeb0330440e77d75f05f604ca3c2a0f88e83aa4
      },
      fail: function (res) {
        console.log("加载失败");
      }
    });
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
    var _this = this;
    wx.request({
      url: 'http://118.25.23.44:8080/user/detail',
      data: {
        username: this.data.userInfo.username,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res.data);
        _this.setData({ tags: res.data.data.tags });
        _this.setData({ next: res.data.data.tags.length })
        _this.setData({ nickname: res.data.data.nickname });
        _this.setData({ location: res.data.data.loc });
        _this.setData({ introduction: res.data.data.introduction });
        _this.setData({ headshot: res.data.data.headshot });
        _this.setData({ email: res.data.data.email });
        if (res.data.data.gender == "1") {
          _this.setData({ gender: "男" });
        } else {
          if (res.data.data.gender == "2")
          {
            _this.setData({ gender: "女" });
          }
          else 
          {
            _this.setData({ gender: "未知" });
          }
        }
        //_this.setData({ gender: res.data.data.gender});
        _this.setData({ phone: res.data.data.phonenumber });
        _this.setData({ username: res.data.data.username });
        _this.setData({ password: res.data.data.pwd });
        

      },
      fail: function (res) {
        console.log("加载失败");
      }
    });
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

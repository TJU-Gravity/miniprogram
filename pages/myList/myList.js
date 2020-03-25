// pages/myLsit/myList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options:{},
    posts:{},
    abstract:[],
    txtStyle:[],
    delBtnWidth: 180//删除按钮宽度单位（rpx）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options:options});
    var _this = this;
    var i = 0;
    var summary = new Array();
    var style = new Array();
    wx.request({
      url: app.globalData.host+'/post/myList',
      data: {
        username:options.username,
        page: 1,
        size: 20
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res.data);
        _this.setData({ posts: res.data.data });
        for (i = 0; i < res.data.data.list.length; i++) {
          summary[i] = res.data.data.list[i].postbody.substr(0, 15);
          style[i]='';
        }
        _this.setData({ abstract: summary });
        _this.setData({txtStyle : style});
      },
      fail: function (res) {
        console.log("加载失败"); 
        wx.showToast({ title: '加载失败', icon: 'none' });
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

  touchS: function (e) {
   //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },

  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if(disX > 0){//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.posts.list;
      var style = this.data.txtStyle;
      style[index]=txtStyle;
      this.setData({
        txtStyle:style
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.posts.list;
      var style = this.data.txtStyle;
      style[index] = txtStyle;
      this.setData({
        txtStyle: style
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  //删除帖子
  onDelete: function (e) {
    var _this = this;
    wx.showModal({
      title: '警告',
      content: '确定删除该帖子？此操作不可恢复',
      success(res) {
        if (res.confirm) {
          console.log('确定删除');
          _this.deletePost(e);
        } else if (res.cancel) {
          console.log('取消删除')
        }
      }
    });
    
  },
  //确定删除
  deletePost:function(e){
    var id = e.currentTarget.dataset.index;
    var _this = this;
    wx.request({
      url: app.globalData.host +'/post/delete',
      data: {
        ID: this.data.posts.list[id].postid
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res);
        _this.onLoad(_this.data.options);
        wx.showToast({ title: '删除成功', icon: 'none' });
      },
      fail: function (res) {
        console.log("删除失败");
        wx.showToast({ title: '删除失败', icon: 'none' });
      }
    });
  },
  //开启招募
  onOpenState:function(e){
    var id = e.currentTarget.dataset.index;
    var _this = this;
    wx.request({
      url: app.globalData.host +'/post/changeState',
      data: {
        ID: this.data.posts.list[id].postid,
        state:1
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res);
        _this.onLoad(_this.data.options);
      },
      fail: function (res) {
        console.log("修改失败");
        wx.showToast({ title: '修改失败', icon: 'none' });
      }
    });
  },
  //关闭招募
  onCloseState: function (e) {
    var id = e.currentTarget.dataset.index;
    var _this = this;
    wx.request({
      url: app.globalData.host +'/post/changeState',
      data: {
        ID: this.data.posts.list[id].postid,
        state: 0
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res);
        _this.onLoad(_this.data.options);
      },
      fail: function (res) {
        console.log("修改失败");
        wx.showToast({ title: '修改失败', icon: 'none' });
      }
    });
  }
})
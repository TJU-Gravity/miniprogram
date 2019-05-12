//post_list.js
//获取应用实例
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts:{},
    abstract:[],
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;
    var i=0;
    var summary=new Array();
    wx.request({
      url: 'http://118.25.23.44:8080/post/list',
      data: {
        page:1,
        size:10
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'//默认值
      },
      success: function (res) {
        console.log(res.data);
        _this.setData({posts:res.data.data});

        for (i = 0; i < length(res.data.data.list);i++){
          summary[i] = res.data.data.list.postbody[i].substr(0,15);
        }
        _this.setData({ abstract: summary });
        console.log(_this.data.abstract);
      },
      fail: function (res) {
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
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
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
  onChange(event){
    console.log(event.detail);
  },
  onClick:function(e){
    var id=e.currentTarget.dataset.id;
    console.log('../postDetail/postDetail?id=' + id);
    wx.navigateTo({
      url: '../postDetail/postDetail?id='+id,
    })
  },
  onClickAdd(){
    wx.navigateTo({
      url: '../add_post/add_post',
    });
  }
})
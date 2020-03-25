//add_post.js
//获取应用实例
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username:'',
    teamname:'',
    title:'',
    content:'',
    type:'1',
    value:1,
    team:{},
    options:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({options:options});
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

  onClickPost() {
    // console.log(this.data.team);
    if (this.data.type=='1') {
      if (this.data.team.team_name==null)
      {

      }else{
      wx.request({
        url: app.globalData.host+'/post/team/add',
        data: {
          posttype: this.data.type,
          posterid: this.data.options.username,
          title: this.data.title,
          postbody: this.data.content,
          state: this.data.value + 1,
          team: this.data.team,
          hits: 0,

        },
        method: 'POST',
        header: {
          'content-type': 'application/json'//默认值
        },
        success: function (res) {
          console.log(res);
          console.log("发布成功");
          wx.showToast({ title: '发布成功', icon: 'none' });
          wx.navigateBack({
            delta: 1
          });
        },
        fail: function (res) {
          console.log("发布失败");
        }
      });
    }}else{
      wx.request({
        url: app.globalData.host +'/post/add',
        data: {
          posttype: this.data.type,
          posterid: this.data.options.username,
          title: this.data.title,
          postbody: this.data.content,
          state: this.data.value + 1,
        },
        method: 'POST',
        header: {
          'content-type': 'application/json'//默认值
        },
        success: function (res) {
          console.log(res);
          console.log("发布成功");
          wx.showToast({ title: '发布成功', icon: 'none' });
          wx.navigateBack({
            delta: 1
          });
        },
        fail: function (res) {
          console.log("发布失败");
        }
      });
    }
  },
  onChangeTitle(event) {
    this.setData({ title: event.detail });
  },
  onChangeContent(event) {
    this.setData({ content: event.detail });
  },
  onChangeType(event){
    this.setData({ type:event.detail });
    if (event.detail=='2')
      this.setData({team:''});
  },
  onChangeTeamname(event) {
    this.setData({ teamname: event.detail });
    var team={
      team_name:this.data.teamname,
      captainid: this.data.options.username,
      avatar:'',
      introduction:'',
      label:''
      };
    this.setData({ team: team });
  },
  onChangeNum(event) {
    this.setData({ value: event.detail });
  },
})
// pages/postList/postList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postDetail:{
      title:"油菜花",
      body:"农村里的山水才能最贴近人的灵魂，春天也只有农村里的才最美丽和最真实。第一声布谷鸟的啼叫回荡在山谷里，不知道名字的花突然开放，让人没有准备。春天是要来得更早些，雪变成雨的那一瞬间，风变得温柔的那一刹那，种子发芽的那一刻，冬眠的动物睁开了眼睛……"
    },
    goodsKey: [{
      avatar: "/images/images/avatar/1.png",
      date: {
        year: 2019,
        month: 2,
        day: 3
      },
      imgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2546335362.jpg",
      content: "同济大学，1907年建校",
      id: 0,
      headImgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2546335362.jpg",
      datetime: "18:12",
      detail: "国立柱原是明清古建筑上的柱子，原计划用作校门，后来没有做成，之后被埋在地下，50年沉睡在地下，2007学校大建挖出，觉得很好看，就做了个顶，两根柱子上本别刻了继往、开来四个字，现在已经是学校的一个地标了",
      auther: "韦朝旭",
      goods_owner: "韦朝旭",
      goods_type: "钱包",
    },
    {
      avatar: "/images/images/avatar/2.png",
      date: {
        year: 2019,
        month: 1,
        day: 13
      },
      imgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549177902.jpg",
      content: "爱校路在图书馆后面，11月的枫叶很好看",
      id: 1,
      headImgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2549177902.jpg",
      datetime: "18:08",
      detail: "一头连着图书馆，一头连着大礼堂，路的左侧是同心河，右侧是杜鹃花，每年3、4月份开放，爱校路是每个同济人都走过的四季",
      auther: "萧",
      goods_owner: "索隆",
      goods_type: "校园卡",
    }]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  }
})
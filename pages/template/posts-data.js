var local_database = [{
    avatar: "/images/images/avatar/1.png",
    date: {
      year:2019,
      month:2,
      day:3
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
  },
  {
    avatar: "/images/images/avatar/3.png",
    date: {
      year: 2018,
      month: 5,
      day: 5
    },
    imgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2545472803.jpg",
    content: "草坪的草还是很扎人的。。。。",
    id: 2,
    headImgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2545472803.jpg",
    datetime: "19:06",
    detail: "嘉定的草坪是真的特别的多了10到12月，嘉定的草坪陆续变黄",
    auther: "韦朝旭",
    goods_owner: "乌索普",
    goods_type: "锤子",
  },
  {
    avatar: "/images/images/avatar/4.png",
    date: {
      year: 2018,
      month: 9,
      day: 26
    },
    imgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2542973862.jpg",
    content: "真的是很好看的",
    id: 3,
    headImgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2542973862.jpg",
    datetime: "14:54",
    detail: "只有在嘉定，才会有这么与世无争的一些石凳，就那么静静的在那里",
    auther: "韦朝旭",
    goods_owner: "乔巴",
    goods_type: "药箱",
  },
  {
    avatar: "/images/images/avatar/5.png",
    date: {
      year: 2019,
      month: 3,
      day: 6
    },
    imgSrc: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2541901817.jpg",
    content: "随风飘动的芦苇",
    id: 4,
    headImgSrc: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2541901817.jpg",
    datetime: "00:00",
    detail: "嘉定的湖边，芦苇丛生，看着随风摇曳的芦苇，一切宠辱似乎都不存在了，只感受到惬意。",
    auther: "萧",
    goods_owner: "路飞",
    goods_type: "帽子",
  },
  {
    avatar: "/images/images/avatar/3.png",
    date: {
      year: 2019,
      month: 2,
      day: 8
    },
    imgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2541035591.jpg",
    content: "最老的宿舍楼,历史的见证",
    id: 5,
    headImgSrc: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2541035591.jpg",
    datetime: "9:07",
    detail: "同济最老的宿舍楼，瓦楞上的落叶，墙上斑驳的印记，都是时光的见证，而楼里，走过了十几代同济人",
    auther: "朝旭",
    goods_owner: "香吉士",
    goods_type: "菜刀",
  },
]

var userinfo={
  name: "韦朝旭",
  tel: "183****7403",
  address: "同济大学西北三",
  qrcode: "待生成",
  balance: "￥5.5",
}
var info = [{
    title: "姓名",
    img: "/images/icons/卡.png",
    id: 0
  },
  {
    title: "电话",
    img: "/images/icons/钥匙.png",
    id: 1
  },
  {
    title: "地址",
    img: "/images/icons/贴纸.png",
    id: 2
  },
  {
    title: "二维码",
    img: "/images/icons/贴纸.png",
    id: 3
  },
  {
    title: "账户",
    img: "/images/icons/卡.png",
    id: 4
  },
  {
    title: "设置",
    img: "/images/icons/钥匙.png",
    id: 5
  },
]

module.exports = {
  goodsList: local_database,
  userinfo: userinfo
}
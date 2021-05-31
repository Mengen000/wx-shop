import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({
  data: {
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],
  onLoad: function (options) {
    // 1.先判断本地存储中是否有旧的数据
    // 2.没有旧数据 直接发请求
    // 3.有旧的数据 同时 旧的数据也没有过期 就使用 本地存储中的旧数据即可

    const Cates = wx.getStorageSync('cates');
    if (!Cates) {
      this.getCates();
    } else {
      if (Date.now() - Cates.time > 1000 * 60 * 5) {
        this.getCates();
      } else {
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: '/categories',
    // }).then((result) => {
    //   this.Cates=result.data.message;
    //   wx.setStorageSync('cates', {time:Date.now(),data:this.Cates});
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   });
    // })
    const res = await request({
      url: '/categories'
    });
    this.Cates = res;
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    });
    let leftMenuList = this.Cates.map(v => v.cat_name);
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });
  },
  handleItemTap(e) {
    const {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      rightContent,
      currentIndex: index,
      scrollTop: 0
    });
  }
})
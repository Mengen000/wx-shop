
import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款",
        isActive:false
      }
    ],
    orders:[]
  },
  onShow: function () {
    const token=wx.getStorageSync('token');
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return;
    }
    let pages = getCurrentPages();
    let currentPage=pages[pages.length-1];
    const {type}=currentPage.options;
    this.changeTitleByindex(type-1);
    this.getOrders(type);
  },
  changeTitleByindex(index){
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  // 获取订单列表的方法
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}});
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  handleTabItemChange(e){
    const {index}=e.detail;
    this.changeTitleByindex(index);
    this.getOrders(index+1);
  },
})
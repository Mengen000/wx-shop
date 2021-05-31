import {
  request
} from "../../request/index.js";
// 这个玩意是因为小程序使用es7的知识报错
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({

  data: {
    goodsObj:{},
    isCollect:false
  },
  GoodsInfo:{},
  onShow: function () {
    let pages=getCurrentPages();
    let currentPages=pages[pages.length-1];
    const { goods_id }=currentPages.options;
    this.getGoodsDetail(goods_id);
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:'/goods/detail',data:{goods_id}});
    this.GoodsInfo=goodsObj;
    let collect=wx.getStorageSync('collect')||[];
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },
  handlePrevewImage(e){
    const urls=this.GoodsInfo.pics.map(v=>v.pics_mid);
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    })
  },
  // 点击加入购物车
  handleCartAdd(){
    let cart=wx.getStorageSync('cart')||[];
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '加入成功',
      icon:'success',
      mask:true
    })
  },
  handleCollect(){
    let isCollect=false;
    let collect=wx.getStorageSync('collect')||[];
    let index=collect.findIndex(v=>v.goods_id==this.GoodsInfo.goods_id);
    if(index!==-1){
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消收藏',
        icon:'success',
        mask:true
      });
    }else{
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true
      });
    }
    wx.setStorageSync('collect', collect);
    this.setData({
      isCollect
    });
  }
})
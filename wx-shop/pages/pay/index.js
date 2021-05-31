import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {
  request
} from "../../request/index.js";
Page({
  data: {
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onLoad: function (options) {

  },
  onShow(){
    const address=wx.getStorageSync('address');
    let cart=wx.getStorageSync('cart')||[];
    cart=cart.filter(v=>v.checked);
    let totalPrice=0,totalNum=0;
    cart.forEach(v => {
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
    });
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },
  async handleOrderPay(){
    try{
      const token=wx.getStorageSync('token');
      if(!token){
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      const order_price=this.data.totalPrice;
      const consignee_addr=this.data.address.all;
      const cart=this.data.cart;
      let goods=[];
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }));
      const orderParams={order_price,consignee_addr,goods}
      // 在这一步需要结构出订单号，因为接口调用有问题，无法解构，订单编号写死
      // const {order_number}=await request({url:'/my/orders/create',method:"post",data:orderParams,header});
      const res=await request({url:'/my/orders/create',method:"post",data:orderParams});
      const order_number='4542ASSAF7A4D4A5SD5';
      const {pay}=await request({url:'my/orders/req_unifiedorder',method:"post",data:{order_number}});
      await requestPayment(pay);
      const res2=await request({url:'/my/orders/chkOrder',method:"post",data:{order_number}});
      await showToast({title:"支付成功"});
      let newCart=wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync('cart', newCart);
      wx.navigateTo({
        url: '/pages/order/index',
      });
    }catch(err){
      await showToast({title:"支付失败"});
    }
  }
})
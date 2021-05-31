import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
Page({
  data: {
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onLoad: function (options) {

  },
  onShow(){
    const address=wx.getStorageSync('address');
    const cart=wx.getStorageSync('cart')||[];
    // 避免浪费性能 把全选的判断放入 foreach
    // const allChecked=cart.length?cart.every(v=>v.checked):false;
    this.setData({
      address
    });
    this.setCart(cart);
  },
  async handleChooseAddress() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      const res2 = await chooseAddress();
      wx.setStorageSync('address', res2)
    } catch (error) {
      console.log(error)
    }
  },
  handeItemChange(e){
    const goods_id=e.currentTarget.dataset.id;
    let {cart}=this.data;
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    cart[index].checked=!cart[index].checked;
    this.setCart(cart);
  },
  handeItemAllChange(e){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart)
  },
  // 重新计算购物车的数据
  setCart(cart){
    let allChecked=true,totalPrice=0,totalNum=0;
    cart.forEach(v => {
      if(v.checked){
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false
      }
    });
    allChecked=cart.length!=0?allChecked:false;
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
    wx.setStorageSync('cart', cart);
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e){
    const {operation,id}=e.currentTarget.dataset;
    let {cart}=this.data;
    const index=cart.findIndex(v=>v.goods_id===id);
    if(cart[index].num===1&&operation===-1){
      const res=await showModal({content:"是否删除该商品？"});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      cart[index].num+=operation;
      this.setCart(cart);
    }
  },
  async handlePay(){
     const {address,totalNum}=this.data;
     if(!address.userName){
      await showToast({title:"还未填写收货地址"}) 
      return;
     }
     if(totalNum===0){
      await showToast({title:"还未选购商品"}) 
      return;
     }
     wx.navigateTo({
       url: '/pages/pay/index',
     })
  }
})
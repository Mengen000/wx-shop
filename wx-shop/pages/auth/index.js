import {
  request
} from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime.js';
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  login
} from "../../utils/asyncWx.js";

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async handleGetUserInfo(e){
    try{
        // encryptedData iv rawData signature
        const {encryptedData,iv,rawData,signature}=e.detail;
        const {code}=await login();
        console.log(code)
        const loginParams={encryptedData,iv,rawData,signature,code};
        const res=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
        wx.setStorageSync('token','BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
        wx.navigateBack({
          delta: 1,
        })
    }catch(error){
      console.log(error)
    }
    
  }
})
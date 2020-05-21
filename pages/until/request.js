
// async await 部分老机型不支持 以后可以考虑优化 
var md5 = require('md5.js');
var signJs = require('sign.js');
// 同时发送异步代码的次数
let ajaxTimes=0;
export const request=(params)=>{
    //给参数加上sign验签
    var dataJson = signJs.getSign(params)
     //默认get请求
    if (!parms.type) {
      parms.type = 'GET'
    }
  // 判断 url中是否带有 / 私有路径 / 请求的是私有的路径 带上header token
//   let header={...params.header};
//   if(params.url.includes("/私有路径/")){
//     // 拼接header 带上token
//      header["Authorization"]=wx.getStorageSync("token");
//   }
ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });
    

  // 定义公共的url
//   const baseUrl="https://api.jiangxinxiaozhen.com";
  const baseUrl = 'http://192.168.0.7:8080/';
  return new Promise((resolve,reject)=>{
    wx.request({
     ...dataJson,
     url:baseUrl+params.url,
     header:{"content-type": "application/x-www-form-urlencoded"},
     success:(result)=>{
       resolve(result);
     },
     fail:(err)=>{
       reject(err);
     },
     complete:()=>{
      ajaxTimes--;
      if(ajaxTimes===0){
        //  关闭正在等待的图标
        wx.hideLoading();
      }
     }
    });
  })
}
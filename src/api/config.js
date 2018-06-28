import env from '../../build/env';
import axios from 'axios';
import {router} from '../router'
import Vue from 'vue';
const EventBus = new Vue();
const currentHost = location.host;
const nativeHost = 'http://10.10.10.107:8080'
//const nativeHost = 'http://10.10.10.166:8011'
console.log(env)
const host =  env === 'development'
    ?nativeHost
    :currentHost === 'beta.admin.moscales.com'
    ?'http://beta.admin.moscales.com'
    :'http://moscales.7wenyi.com';

const api = host + '/backend';
const $http = axios.create({
    baseURL: api,
    timeout: 30000,
    withCredentials: true
});


$http.interceptors.request.use(config => {
	return config;
})

$http.interceptors.response.use(res => {
	//console.log(res)
	
	let {code,data,msg} = res.data
	if(code != 200){
		EventBus.$Message.error(msg)
    if(code == 10000){
      if(router.currentRoute.query.redirect){
        return {data:null};
      }
      router.replace({
        name: 'login',
        query: { redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
      })
    }
		return {data:null};
	}else{
		return res.data;
	}
	
}, error => {
	console.log(error)
	var originalRequest = error.config;
	if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1 && !originalRequest._retry){
		router.push({
			name: 'error-500'
		})
		return;
	}
  if(error.response){
  	if (error.response.status === 403) {
  		router.push({
  			name: "error-403"
  		});
  	}
  	if (error.response.status === 500) {
  		router.push({
  			name: "error-500"
  		});
  	}
  	if (error.response.status === 404) {
  		router.push({
  			name: "error-404"
  		});
  	}
  }
	return Promise.reject(error);
});

export default $http;
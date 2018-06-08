import axios from 'axios';
import env from '../../build/env';
const currentHost = location.host;
console.log(env)
const host =  env === 'development'
    ?'http://10.10.10.166:8011'
    :currentHost === 'beta.admin.moscales.com'
    ?'http://beta.admin.moscales.com'
    :'http://moscales.7wenyi.com';

const api = host + '/backend';
const $http = axios.create({
    baseURL: api,
    timeout: 30000,
    withCredentials: true
});


// $http.interceptors.request.use(config => {

// 	return config;
// })

// $http.interceptors.response.use(res => {

// 	return res;
// }, err => {

// 	return Promise.reject(err);
// });

/* 
	 系统管理
*/ 

// 登录
export const login = params => { return $http.post(`/login/login`, params).then(res => res.data)};

/* 
	 员工管理
*/ 

// 获取员工列表
export const getEmployees = params => { return $http.post(`/generalize_user/finds`, params).then(res => res.data)};

// 添加员工
export const addEmployee = params => { return $http.post(`/generalize_user/create`, params).then(res => res.data)};

// 修改员工
export const editEmployee = params => { return $http.post(`/generalize_user/edit`, params).then(res => res.data)};

// 删除员工
export const delEmployee = params => { return $http.post(`/generalize_user/delete`, params).then(res => res.data)};

// 获取成员管理列表
export const getUsers = params => { return $http.post(`/system_user/finds`, params).then(res => res.data)};

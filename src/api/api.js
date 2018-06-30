
import $http from './config'
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

/* 
	 统计管理
*/ 

// 获取员工产出统计
export const getStaffDayStatistic = params => { return $http.post(`/StaffStatistic/getStaffDayStatistic`, params).then(res => res.data)};

// 获取员工设备产出统计
export const getStaffDeviceDetail = params => { return $http.post(`/StaffStatistic/getStaffDeviceDetail`, params).then(res => res.data)};

/* 
	店铺管理
*/ 

// 获取店铺列表
export const getStores = params => { return $http.post(`/shopinfo/finds`, params).then(res => res.data)};

// 获取店铺详情
export const getStoreDetail = params => { return $http.post(`/shopinfo/detail`, params).then(res => res.data)};

// 修改店铺负责人
export const editSystemUser = params => { return $http.post(`/shopinfo/editSystemUser`, params).then(res => res.data)};

/* 
	账号管理
*/ 

// 获取账号列表
export const getSystemUser = params => { return $http.post(`/systemUser/finds`, params).then(res => res.data)};

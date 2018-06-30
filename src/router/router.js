import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};


export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue') },
        { path: 'employeesDevice/:id', title: '设备列表', name: 'employees-device', component: () => import('@/views/statistics/employeesDevice.vue') },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/employee',
        icon: 'ios-person',
        name: 'employee',
        title: '员工信息管理',
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'ios-person',
                title: '员工信息管理',
                name: "employee-index",
                component: () => import('@/views/employee/index.vue')
            },
            
        ]
    },
    {
        path: '/statistics',
        icon: 'stats-bars',
        name: 'statistics',
        title: '统计管理',
        component: Main,
        children: [
            {
                path: 'employeesOutput',
                icon: 'arrow-graph-up-right',
                title: '员工产出统计',
                name: "employees-output",
                component: () => import('@/views/statistics/employeesOutput.vue')
            // }, {
            //     path: 'employeesOutput1',
            //     icon: 'arrow-graph-up-right',
            //     title: '员工产出统计',
            //     name: "employees-output1",
            //     component: () => import('@/views/statistics/employeesOutput.vue')
            },
            
        ]
    },
    {
        path: '/store',
        icon: 'ios-home',
        name: 'store',
        title: '店铺管理',
        component: Main,
        children: [
            {
                path: 'index',
                icon: 'ios-home',
                title: '店铺管理',
                name: "store-index",
                component: () => import('@/views/store/index.vue')
            },
            
        ]
    },
  
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];

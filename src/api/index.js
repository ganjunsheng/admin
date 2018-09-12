import axios from 'axios'
// 配置基本路径
const baseURL = 'http://localhost:8888/api/private/v1/'
// 设置默认路径的基本路径
axios.defaults.baseURL = baseURL

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 将token给到一个前后台约定好的key中，作为请求发送
  var token = localStorage.getItem('mytoken')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 登录
export const login = (params) => {
  return axios.post('login', params).then((res) => {
    return res.data
  })
}

// 获取用户数据
export const getUserList = (pa) => {
  return axios.get('users', {params: pa}).then((res) => {
    // console.log(res)
    return res
  })
}

// 实现添加用户数据
export const addUser = (pa) => {
  return axios.post('users', pa).then((res) => {
    return res.data
  })
}
// 实现编辑功能
export const editUser = (pa) => {
  return axios.put(`users/${pa.id}`, pa).then((res) => {
    return res.data
  })
}

// 实现删除功能
export const deleteUserById = (id) => {
  return axios.delete(`users/${id}`).then((res) => {
    // console.log(res)
    return res.data
  })
}

// 修改用户状态
export const updateUserStateById = (pa) => {
  return axios.put(`users/${pa.id}/state/${pa.state}`).then((res) => {
    return res.data
  })
}

// 获取所有角色列表数据
export const getAllRoleList = () => {
  return axios.get('roles').then((res) => {
    // console.log(res)
    return res.data
  })
}

// 实现单个用户角色的分配
export const grantRoleById = (pa) => {
  return axios.put(`users/${pa.id}/role`, {rid: pa.id}).then((res) => {
    // console.log(res)
    return res.data
  })
}

// 获取权限列表数据
export const getAllRightsList = (type) => {
  return axios.get(`rights/${type}`).then((res) => {
    // console.log(res)
    return res.data
  })
}

// 实现删除指定角色的指定权限
export const deleteroleright = (roleid, rightid) => {
  return axios.delete(`roles/${roleid}/rights/${rightid}`).then((res) => {
    // console.log(res)
    return res.data
  })
}

//
export const grantroleright = (pa) => {
  return axios.post(`roles/${pa.roleid}/rights`, {rids: pa.rids}).then((result) => {
    return result.data
  })
}

// 实现角色的添加
export const addRole = (pa) => {
  return axios.post(`roles`, pa).then((result) => {
    return result.data
  })
}

// 动态生成侧边栏
export const getLeftMenu = () => {
  return axios.get(`menus`).then((result) => {
    return result.data
  })
}

//  获取商品分类数据
export const getCategories = (type) => {
  return axios.get(`categories`, {params: {'type': type}}).then((result) => {
    console.log(result)
    return result.data
  })
}

// 实现添加商品分类
export const addCategory = (pa) => {
  return axios.post('categories', pa).then((result) => {
    return result.data
  })
}

// 获取商品列表
export const getGoods = (pa) => {
  return axios.get(`goods`, {params: pa}).then((result) => {
    return result.data
  })
}

// 添加商品
export const addGoods = (pa) => {
  return axios.post('goods', pa).then((result) => {
    return result.data
  })
}

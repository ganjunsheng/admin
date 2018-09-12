import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import User from '../views/user/User.vue'
import Right from '../views/right/Right.vue'
import Role from '../views/right/Role.vue'
import Categories from '../views/goods/Categories.vue'
import Goods from '../views/goods/Goods.vue'
import List from '../views/goods/GoodsList.vue'
import Add from '../views/goods/GoodsAdd.vue'
import Reports from '../views/report/Reports.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login
    },
    {
      name: 'Home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'User',
          path: 'users',
          component: User
        },
        {
          name: 'Right',
          path: 'rights',
          component: Right
        },
        {
          name: 'Role',
          path: 'roles',
          component: Role
        },
        {
          name: 'Categories',
          path: 'categories',
          component: Categories
        },
        {
          name: 'Goods',
          path: 'goods',
          component: Goods,
          redirect: {path: 'goods/list'},
          children: [
            {
              name: 'List',
              path: 'list',
              component: List
            },
            {
              name: 'Add',
              path: 'add',
              component: Add
            }
          ]
        },
        {
          name: 'Reports',
          path: 'reports',
          component: Reports
        }
      ]
    }
  ]
})

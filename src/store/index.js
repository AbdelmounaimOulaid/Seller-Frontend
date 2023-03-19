import { createStore } from 'vuex'
import user from './modules/user'
import alert from './modules/alert'
import product from './modules/product'
import sale from './modules/sale'
import order from './modules/order'
import inventory from './modules/inventory'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    product,
    alert,
    sale,
    order,
    inventory
  }
})

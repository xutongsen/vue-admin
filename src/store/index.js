import Vue from "vue";
import Vuex from "vuex";
import getters from './getters';

Vue.use(Vuex);


// webpack 工程化方法 传送门: https://webpack.js.org/guides/dependency-management/#requirecontext 
const modulesFiles = require.context('./modules', true, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath) => {

  // 正则 ./user.js 为例 : /^\.\/ 为 ./开头 小分组（.*）出去换行符任意字符  \.\w+ .后面1个或1个以上的任意字符
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')

  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
},{})


const store = new Vuex.Store({
  modules,
  getters
})

export default store

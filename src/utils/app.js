import Cookies from 'js-cookie'
import { caching } from '../variable/common'
export function getToken() {
  return Cookies.get( caching.Token )
}

export function setToken(token) {
  return Cookies.set( caching.Token , token)
}

export function removeToken() {
  return Cookies.remove( caching.Token  )
}

/**
 * @function dataType
 * @param {data} 数据
 * @return 返回数据类型
 */
export function dataType(data) {
  return Object.prototype.toString.call(data)
}

/**
 * @function getStorage
 * @param {name} 获取缓存的名称
 * @param {type} 缓存类型
 * @param {dataType} 返回数据的类型  1.obj 2.arr 3.str
 * @return 返回缓存数据
 */
export function getStorage(name, type, dataType = 'obj') {
  if( !name ){
    console.error('没有对象名称')
    return
  }
  let data = type === 'sessionStorage' ? sessionStorage.getItem(name) : localStorage.getItem(name)
  switch (dataType) {
    case 'obj':
      return data? new Object():JSON.parse(data)
      break;
    case 'arr':
      return data? new Array():data.split(',')
      break
    case 'str':
      return data? '':data
      break

  }
}


/**
 * @function setStorage
 * @param {name} 获取缓存的名称
 * @param {type} 缓存类型
 * @param {storageData} 存储数据
 * @return 返回缓存数据
 */
export function setStorage(name, type,storageData) {
  if( !name ){
    console.error('没有对象名称')
    return
  }
  if( !storageData ){
    console.error('没有传递数据')
    return
  }
  let formatData = ''
  let dataType =  dataType(storageData)
  switch (dataType) {
    case '[object Object]':
      formatData = JSON.stringify(storageData)
      break;
    case '[object Array]':
      formatData = storageData.join(',')
      break
    case '[object String]':
      formatData = storageData.toString()
      break;
  }
  type === 'sessionStorage' ? sessionStorage.setItem(name,formatData) : localStorage.setItem(name,formatData)
}
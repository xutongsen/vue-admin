import Cookies from 'js-cookie'
import { caching } from '../variable/common'
export function getToken() {
  return Cookies.get( caching.Token )
}



/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 * idx ,循环第几次，用&拼接
 * return URL参数字符串
 */
export function urlEncode(param, idx, key, encode) {
  
  if(param==null) return '';
  let paramStr = '';
  let tmp = typeof (param);
  if (tmp == 'string' || tmp == 'number' || tmp == 'boolean') {
    let one_is =idx<3?'?':'&';
    paramStr += one_is + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      idx++
      paramStr += urlEncode(param[i],idx, k, encode);
    }
  }
  return paramStr;
  
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


/**
 * 判断是否存在class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}



/**
 * 添加class
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 清除
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function offsetDistance(el) {
  let left = el.offsetLeft;
  let top = el.offsetTop
  let parent = el.offsetParent
  console.log(parent)
  while( parent ) {
    left += parent.clientLeft
    left += parent.offsetLeft
    top += parent.clientTop
    top += parent.offsetTop
    parent = parent.offsetParent
  }
  return {
    left,
    top
  }
}
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

/**
 * 防抖
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate 是否立即执行
 * @return {any} 
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 日期转换器
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}


/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
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
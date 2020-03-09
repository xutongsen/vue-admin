import './waves.css'
const context = '@wavesFunction'
function handleClick(el, binding) {
  function handle(e) {

    // 参数合并
    const customOpts = Object.assign({}, {
      ele: el, // 波纹作用元素
      type: 'hit', // hit 点击位置扩散 center中心点扩展
      color: 'rgba(0, 0, 0, 0.15)' // 波纹颜色
    }, binding.value)


    // 操作dom
    const target = customOpts.ele

    if (target) { 

      target.style.position = 'relative'
      target.style.overflow = 'hidden'

      const rect = target.getBoundingClientRect() // 获取宽高

      let ripple = target.querySelector('.waves-ripple') // 获取标签
      
      if ( !ripple ) {
        ripple = document.createElement('span')
        ripple.className = 'waves-ripple'
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px'
        target.appendChild(ripple)
      } else {
        ripple.className = 'waves-ripple'
      }
      switch (customOpts.type) {
        case 'center':
          ripple.style.top = rect.height / 2 - ripple.offsetHeight / 2 + 'px' // 不同高度 半径相减就是差值 top 就是中心对齐了
          ripple.style.left = rect.width / 2 - ripple.offsetWidth / 2 + 'px'
          break
        default:
          ripple.style.top =
            (e.pageY - rect.top - ripple.offsetHeight / 2 - document.documentElement.scrollTop ||
              document.body.scrollTop) + 'px' // 点击坐标 -  父级距离上边高度 - 自身的一半 - 卷曲高度(点击坐标包括卷曲高度)
          ripple.style.left =
            (e.pageX - rect.left - ripple.offsetWidth / 2 - document.documentElement.scrollLeft ||
              document.body.scrollLeft) + 'px'
      }
      ripple.style.backgroundColor = customOpts.color
      ripple.className = 'waves-ripple z-active'
      return false

    }
  }
  if( !el[context] ) {
    el[context] = {
      removeHandle: handle
    }
  } else {
    el[context].removeHandle = handle
  }
  return handle
}

export default {
  bind(el, binding) {
    el.addEventListener('click', handleClick(el, binding), false)
  },
  update(el, binding) {
    el.removeEventListener('click', el[context].removeHandle, false)
    el.addEventListener('click', handleClick(el, binding), false)
  },
  unbind(el, binding) {
    el.removeEventListener('click', el[context].removeHandle, false)
    el[context] = null
    delete el[context]
  }
}
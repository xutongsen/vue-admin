
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583821543883&di=f7f5244f6da3a1703d8249730ac8b4de&imgtype=0&src=http%3A%2F%2Fimage.biaobaiju.com%2Fuploads%2F20181223%2F18%2F1545560413-PYENlDWsbO.jpg',
    name: '管理员'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1583821587942&di=c3e4b7aa4a088e63d6576a4cd9510693&imgtype=0&src=http%3A%2F%2Fwww.mangowed.com%2Fuploads%2Fallimg%2F150626%2F1-15062621564Q59.jpg',
    name: '用户'
  }
}

module.exports = [
  // user login
  {
    url: '/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      // const token = tokens[username]
      const token = username === '111111@qq.com'? tokens.admin : tokens.editor
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

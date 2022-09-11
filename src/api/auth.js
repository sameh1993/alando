import { api } from 'boot/axios'
import { SessionStorage } from 'quasar'
import jwtDecode from 'jwt-decode'

const auth = {

  authenticated () {
    if (this.getToken()) {
      return true
    }
    return false
  },

  setUser (user) {
    SessionStorage.set('customer_identity', user)
  },

  getUser () {
    if (SessionStorage.has('customer_identity')) {
      const $data = SessionStorage.getItem('customer_identity')
      if (!this.empty($data)) {
        if (Object.keys($data).length > 0) {
          try {
            return jwtDecode($data)
          } catch (err) {
            return false
          }
        }
      }
    }
    return false
  },

  setToken (token) {
    SessionStorage.set('customer_token', token)
  },

  getToken () {
    if (SessionStorage.has('customer_token')) {
      const $data = SessionStorage.getItem('customer_token')
      if (!this.empty($data)) {
        return $data
      }
    }
    return false
  },

  logout () {
    SessionStorage.remove('customer_token')
    SessionStorage.remove('customer_identity')
  },

  empty (data) {
    if (typeof data === 'undefined' || data === null || data === '' || data === 'null' || data === 'undefined') {
      return true
    }
    return false
  },

  async authenticate () {
    return api.post('/authenticate', 'token=' + this.getToken())
      .then(result => {
        if (result.data.code === 1) {
          return result.data
        } else {
          throw result.data.msg
        }
      })
      .catch(error => {
        throw error
      })
  }

}
export default auth

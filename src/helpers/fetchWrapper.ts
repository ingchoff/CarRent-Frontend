import router from '@/router'
import { useAuthStore } from '@/stores'
import { useAlert } from '@/utils'

export const fetchWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
}

function request(method: string) {
  return async (url: string, body: any) => {
    const { token, logout } = useAuthStore()
    const requestOptions: any = {
      method,
      headers: { Authorization: `${token}` },
    }
    if (body) {
      requestOptions.headers['Content-Type'] = 'application/json'
      requestOptions.body = JSON.stringify(body)
    }
    try {
      const res = await fetch(url, requestOptions)
      return handleResponse(res)
    } catch (error: any) {
      if (error.message === 'Failed to fetch') {
        await logout()
        router.push('/login')
      }
    }
  }
}

async function handleResponse(response: Response) {
  const { updateAlert } = useAlert()
  if (!response.ok) {
    const { token, refreshToken, logout } = useAuthStore()
    const err = await response.json()
    if (
      response.status === 401 &&
      err.msg === 'could not parse token' &&
      token
    ) {
      await logout()
      router.push('/login')
    } else if (
      response.status === 500 &&
      err === 'TokenExpiredError' &&
      token
    ) {
      await logout()
      router.push('/login')
    } else if (response.status === 401) {
      updateAlert({ type: 'error', message: 'Username or Password is wrong.' })
    }
  } else {
    const data = response.json()
    return data
  }
  // return response.text().then((text) => {
  //   const data = text && JSON.parse(text)
  //   if (!response.ok) {
  //     const { user, logout } = useAuthStore()
  //     if ([401, 403].includes(response.status) && user) {
  //       // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
  //       logout()
  //     }
  //     const error = (data && data.message) || response.statusText
  //     return Promise.reject(error)
  //   }
  //   return data
  // })
}

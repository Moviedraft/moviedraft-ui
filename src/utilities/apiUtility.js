const baseUrl = process.env.REACT_APP_API_BASE_URL
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const apiRequestWithBody = async(endpoint, method, body)=> {
  headers.Authorization = 'Bearer ' + localStorage.getItem('CouchSportsToken')

  return await fetch(baseUrl + endpoint, {
    headers: headers,
    method: method,
    body: JSON.stringify(body)
  })
}

const apiRequestWithoutBody = async(endpoint, method)=> {
  headers.Authorization = 'Bearer ' + localStorage.getItem('CouchSportsToken')

  return await fetch(baseUrl + endpoint, {
    headers: headers,
    method: method
  })
}

export const apiGet = async(endpoint)=> {
  let response = await apiRequestWithoutBody(endpoint, 'GET')

  return response.status === 200 ? response.json() : null
}

export const apiPatch = async(endpoint, body)=> {
  let response = await apiRequestWithBody(endpoint, 'PATCH', body)

  return response.json()
}

export const apiPost = async(endpoint, body)=> {
  let response = await apiRequestWithBody(endpoint, 'POST', body)

  return response.json()
}

export const apiPut = async(endpoint, body)=> {
  let response = await apiRequestWithBody(endpoint, 'PUT', body)

  return response.status === 200 ? response.json() : null
}

export const apiDelete = async(endpoint)=> {
  let response = await apiRequestWithoutBody(endpoint, 'DELETE')

  return response.status === 200 ? response.json() : null
}

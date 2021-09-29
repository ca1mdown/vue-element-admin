import request from '@/utils/request-tygj'

export function fetchStoreList(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeInfo/query',
    method: 'get',
    params: query
  })
}

export function createStore(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeInfo/add',
    method: 'post',
    params: query
  })
}

export function updateStore(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeInfo/update',
    method: 'post',
    params: query
  })
}

export function deleteStore(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeInfo/delete',
    method: 'post',
    params: query
  })
}

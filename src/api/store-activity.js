import request from '@/utils/request-tygj'

export function fetchList(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeActivity/query',
    method: 'get',
    params: query
  })
}

export function createStoreActivity(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeActivity/add',
    method: 'post',
    params: query
  })
}

export function updateStoreActivity(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeActivity/update',
    method: 'post',
    params: query
  })
}

export function deleteStoreActivity(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeActivity/delete',
    method: 'post',
    params: query
  })
}

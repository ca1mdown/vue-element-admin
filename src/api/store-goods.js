import request from '@/utils/request-tygj'

export function fetchList(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeGoods/query',
    method: 'get',
    params: query
  })
}

export function createStoreGoods(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeGoods/add',
    method: 'post',
    params: query
  })
}

export function updateStoreGoods(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeGoods/update',
    method: 'post',
    params: query
  })
}

export function deleteStoreGoods(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeGoods/delete',
    method: 'post',
    params: query
  })
}

import request from '@/utils/request-tygj'

export function fetchList(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeInfo/query',
    method: 'get',
    params: query
  })
}

export function createArticle(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeInfo/add',
    method: 'post',
    params: query
  })
}

export function updateArticle(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeInfo/add',
    method: 'post',
    params: query
  })
}

export function deleteArticle(query) {
  query.session_id = '1e13344fdfd4fb54bd09cb71acae4a2f472b63544ec71bc9c5b80dbc10164322'
  return request({
    url: 'storeInfo/delete',
    method: 'post',
    params: query
  })
}

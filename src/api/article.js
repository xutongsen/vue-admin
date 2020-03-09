import service from "@/utils/axios";

export function fetchList(query) {
  return service({
    url: '/article/list',
    method: 'get',
    params: query
  })
}



export function fetchPv(pv) {
  return service({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  return service({
    url: '/article/create',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return service({
    url: '/article/update',
    method: 'post',
    data
  })
}

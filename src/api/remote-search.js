import service from "@/utils/axios";
export function searchUser(name) {
  return service({
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return service({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}

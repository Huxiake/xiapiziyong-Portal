import request from '@/utils/request'

export function stockList(offset, limit) {
  return request({
    url: '/stock/sectionList?offset=' + offset + '&limit=' + limit,
    method: 'get'
  })
}

export function stockDetails(id) {
  return request({
    url: '/stock/details/getSectionDetails?sectionId=' + id,
    method: 'get'
  })
}

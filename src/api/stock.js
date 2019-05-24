import request from '@/utils/request'

export function stockList(offset, limit) {
  return request({
    url: '/stock/sectionList?offset=' + offset + '&limit=' + limit,
    method: 'get'
  })
}

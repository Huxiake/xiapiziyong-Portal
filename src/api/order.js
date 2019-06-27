import request from '@/utils/request'

// 获取未处理的order列表
export function orderList(params) {
  return request({
    url: '/order/getOrderList?' + params,
    method: 'get'
  })
}

// 获取未处理的order列表
export function toGetGoodsList(params) {
  return request({
    url: '/order/toGetGoodsList?' + params,
    method: 'post'
  })
}

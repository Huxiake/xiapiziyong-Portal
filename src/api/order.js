import request from '@/utils/request'

// 获取未处理的order列表
export function orderList(params) {
  return request({
    url: '/order/getOrderList?' + params,
    method: 'get'
  })
}

// order配货
export function toGetGoodsList(params) {
  return request({
    url: '/order/toGetGoodsList?' + params,
    method: 'post'
  })
}

// order标记待货
export function markWaiting(params) {
  return request({
    url: '/order/markWaiting?' + params,
    method: 'post'
  })
}

// order上传模板
export function uploadOrder(data) {
  return request({
    url: '/order/uploadOrder',
    method: 'post',
    data: data
  })
}

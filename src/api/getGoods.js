import request from '@/utils/request'

// 获取拿货列表
export function getGoodsList(params) {
  return request({
    url: '/getgoods/getGetGoodsList?' + params,
    method: 'get'
  })
}

// 获取拿货反馈
export function getFeedback(params) {
  return request({
    url: '/getgoods/getFeedback?' + params,
    method: 'get'
  })
}

// 标记为已读
export function markRead(params) {
  return request({
    url: '/getgoods/markRead?id=' + params,
    method: 'post'
  })
}

// 处理反馈
export function dealFeedback(params) {
  return request({
    url: '/getgoods/dealFeedback?' + params,
    method: 'post'
  })
}

// 处理反馈
export function editGetGoodsInfo(params) {
  return request({
    url: '/getgoods/editGetGoodsInfo?' + params,
    method: 'post'
  })
}

// 扫码入库
export function scanfMarkGet(params) {
  return request({
    url: '/getgoods/scanfMarkGet',
    method: 'post',
    data: params
  })
}

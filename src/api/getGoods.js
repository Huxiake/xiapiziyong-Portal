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
    url: '/getgoods/markRead?' + params,
    method: 'post'
  })
}

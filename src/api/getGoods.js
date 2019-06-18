import request from '@/utils/request'

// 获取拿货列表
export function getGoodsList(params) {
  return request({
    url: '/getgoods/getGetGoodsList?' + params,
    method: 'get'
  })
}

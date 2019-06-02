import request from '@/utils/request'

// 获取spu列表
export function stockList(offset, limit) {
  return request({
    url: '/stock/getErpSpuList?offset=' + offset + '&limit=' + limit,
    method: 'get'
  })
}

// 修改spu信息
export function uploadErpSpu(data) {
  return request({
    url: '/stock/updateErpSpu',
    method: 'put',
    data: data
  })
}

// 删除spu
export function deleteErpSpu(id) {
  return request({
    url: '/stock/deleteErpSpu?sectionId=' + id,
    method: 'post'
  })
}

// 获取打印列表
export function getPrintList(id_arr) {
  return request({
    url: '/stock/getPrintList?id=' + id_arr,
    method: 'get'
  })
}

// 获取spu详情（sku列表）
export function stockDetails(id) {
  return request({
    url: '/stock/details/getErpSpuDetails?sectionId=' + id,
    method: 'get'
  })
}

// 修改sku信息

// 删除sku

// 上传spu图片
export function uploadSpuPic(data) {
  return request({
    url: '/stock/uploadSpuImg',
    method: 'post',
    data: data
  })
}

// 上传spu图片
export function uploadSpuXls(data) {
  return request({
    url: '/stock/uploadStock',
    method: 'post',
    data: data
  })
}

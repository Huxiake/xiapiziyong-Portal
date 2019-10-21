import request from '@/utils/request'

// 获取spu列表
export function stockList(params) {
  return request({
    url: '/stock/getErpSpuList?' + params,
    method: 'get'
  })
}

// 修改spu信息
export function updateErpSpu(data) {
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

// 上传spu图片
export function uploadSpuPic(data) {
  return request({
    url: '/stock/uploadSpuImg',
    method: 'post',
    data: data
  })
}

// 上传库存xls
export function uploadSpuXls(data) {
  return request({
    url: '/stock/uploadStock',
    method: 'post',
    data: data
  })
}

// 新增sku信息
export function addErpSku(data) {
  return request({
    url: '/stock/details/addErpSku',
    method: 'post',
    data: data
  })
}

// 新增spu信息
export function addErpSpu(data) {
  return request({
    url: '/stock/addErpSpu',
    method: 'post',
    data: data
  })
}

// 修改sku信息
export function updateErpSku(data) {
  return request({
    url: '/stock/details/updateErpSku',
    method: 'put',
    data: data
  })
}

// 删除sku
export function deleteErpSku(id) {
  return request({
    url: '/stock/details/deleteErpSku?skuId=' + id,
    method: 'post'
  })
}

// 扫描入库
export function scaningEnter(id) {
  return request({
    url: '/stock/scanToWarehouse?id=' + id,
    method: 'post'
  })
}

// 扫描出库
export function scaningOut(id) {
  return request({
    url: '/stock/scanToSend?id=' + id,
    method: 'post'
  })
}

// 同步spuID
export function syncSpuID(id) {
  return request({
    url: '/stock/syncSpuID',
    method: 'post'
  })
}

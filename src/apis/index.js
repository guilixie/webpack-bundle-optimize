// 开发平台模块
import axios from '@/utils/axios'

class WorkspaceApi {
  prefix = '/vmp/api/v1'
  getCates () {
    // 获取所有分类
    return axios.get(`${this.prefix}/icategories`)
  }
  getModels () {
    // 获取所有模型
    return axios.get(`${this.prefix}/imodels`)
  }
  getDataSources () {
    // 获取数据源列表
    return axios.get(`${this.prefix}/datasources`)
  }
  getDataSourceCats (id) {
    // 获取数据源分类
    return axios.get(`${this.prefix}/datasources/${id}/categories`)
  }
  getTables ({id, data}) {
    // 分页获取某数据库表格列表
    return axios.post(`${this.prefix}/datasources/${id}/tables`, data)
  }
  getColumns ({dbId, id, data}) {
    // 分页获取数据表字段
    return axios.post(`${this.prefix}/datasources/${dbId}/tables/${id}/columns`, data)
  }
  getModelById (id) {
    // 获取单个模型
    return axios.get(`${this.prefix}/imodels/${id}`)
  }
  addCate (data = {}) {
    // 新建分类
    return axios.post(`${this.prefix}/icategories`, data)
  }
  addModel (data = {}) {
    // 新建模型
    return axios.post(`${this.prefix}/imodels`, data)
  }
  updateCate ({ id, ...data }) {
    // 修改分类名
    return axios.put(`${this.prefix}/icategories/${id}`, data)
  }
  updateModel (data) {
    // 修改模型
    return axios.put(`${this.prefix}/imodels`, data)
  }
  deleteCate (id) {
    // 删除分类
    return axios.delete(`${this.prefix}/icategories/${id}`)
  }
  deleteModel (id) {
    // 删除模型
    return axios.delete(`${this.prefix}/imodels/${id}`)
  }
  analyseModel (data) {
    // 解析模型
    return axios.post(`${this.prefix}/imodels/analysis`, data)
  }
  runModel (data) {
    // 运行模型
    return axios.post(`${this.prefix}/imodels/result`, data)
  }
}

export default new WorkspaceApi()

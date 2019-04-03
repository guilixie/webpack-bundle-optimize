import axios from '@/utils/axios'

class WorkspacePublishApi {
  prefix = '/publish/api/v1'
  saveParam (data) {
    return axios.put(`${this.prefix}/runparams/save`, data)
  }
  deleteParamInfo (id) {
    return axios.delete(`${this.prefix}/runparams/${id}`)
  }
  getExistedParams (data) {
    return axios.post(`${this.prefix}/runparams/page`, data)
  }
}

export default new WorkspacePublishApi()

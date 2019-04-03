// 机器学习平台接口
import axios from '@/utils/axios'

class MLApi {
  prefix = '/ml/api/v1/ml'
  getJobs () {
    // 获取所有任务
    return axios.get(`${this.prefix}/jobs`)
  }
  getJobsPerPage (data) {
    // 获取单页任务
    return axios.post(`${this.prefix}/jobs/page`, data)
  }
  getJobById (id) {
    // 获取单个任务
    return axios.get(`${this.prefix}/jobs/${id}`)
  }
  deleteJob (id) {
    // 删除单个任务
    return axios.delete(`${this.prefix}/jobs/${id}`)
  }
  stopJob (sessionId) {
    // 停止任务
    return axios.delete(`${this.prefix}/stop/${sessionId}`)
  }
  publishJob (id) {
    // 发布
    return axios.put(`${this.prefix}/publish/${id}`)
  }
  downloadLog (appId) {
    // 日志下载
    return `${this.prefix}/log/${appId}`
  }
}

export default new MLApi()

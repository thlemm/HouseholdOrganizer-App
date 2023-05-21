/* eslint-disable */
import axios from 'axios'

const API_URL = 'http://localhost/api/v1/'
// const API_URL = 'https://catalog.thlemm.de/api/v1/'


const plainAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
})

const filesAxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})


export { plainAxiosInstance, filesAxiosInstance }

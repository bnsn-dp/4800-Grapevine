import axios from 'axios'

const baseUrl = 'http://grapevinesite.s3-website-us-west-1.amazonaws.com/'

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json"



    }





})

export default AxiosInstance
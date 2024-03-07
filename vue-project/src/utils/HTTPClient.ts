import type{ AxiosInstance, AxiosResponse } from 'axios';
import axios from "axios";
import { showFailToast } from 'vant';

interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T;
}

class HTTPClient {
    private axiosInstance: AxiosInstance;

    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.axiosInstance = axios.create({
            baseURL,
            timeout: 80000, // 设置超时时间
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    private handleResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
        const responseData = response.data;

        if (responseData.code !== 200) {
            console.log('返回结果非400', responseData);
            showFailToast(responseData.msg);
            throw new Error(`Request failed with code ${responseData.code}: ${responseData.msg}`);
        }

        return responseData.data;
    }

    public async post<T>(url: string, data?: any): Promise<T> {
        const response = await this.axiosInstance.post<ApiResponse<T>>(url, data);
        return this.handleResponse(response);
    }

    public setToken(token: string): void {
        //添加一个header: {"token": token}
        this.axiosInstance.defaults.headers.common['token'] = token;
    }

    public getUrl(): string {
        return this.baseURL;
    }
}

// export default new HTTPClient('http://127.0.0.1:8091');
export default new HTTPClient('https://server1.wzlweb.top/api/sd/biz');
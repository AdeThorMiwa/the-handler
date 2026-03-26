import type { AxiosInstance } from "axios";
import axios from "axios";
import LocalStorageService from "./storage";

export class BaseService {
  protected client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: "http://localhost:5150" });

    this.client.interceptors.request.use((config) => {
      const token = LocalStorageService.readAuthToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    }, Promise.reject);
  }
}

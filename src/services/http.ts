import axios, { type AxiosRequestConfig } from "axios";
import { API_URL } from "./config";

export const http = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function request<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
  try {
    const response = await http.request<T>({
      url: path,
      ...config,
    });

    return response.data;
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    throw new Error(`Error en la petición (${status ?? "red"}).`, { cause: error });
  }
}

export async function requestAllowNotFound<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await http.get<T>(path);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return fallback;
    }

    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    throw new Error(`Error en la petición (${status ?? "red"}).`, { cause: error });
  }
}
import axios from "axios";
import { Person, PaginatedResponse, LikeDislikeResponse } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
const API_BASE_URL = "http://192.168.1.17:8000/api";

const DEVICE_ID_KEY = "@device_id";

// Get or create device ID
const getDeviceId = async (): Promise<string> => {
  try {
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } catch {
    return `default-device-${Date.now()}`;
  }
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const deviceId = await getDeviceId();
    config.headers["X-Device-ID"] = deviceId;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // Main people feed
  getPeople: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Person>> => {
    try {
      const response = await apiClient.get("/people", {
        params: { page, limit },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        limit: response.data.limit || limit,
        total: response.data.total || 0,
        hasMore: response.data.hasMore || false,
      };
    } catch (error: any) {
      console.log("Axios error:", error.message, error.response?.data);
      throw error;
    }
  },

  // Liked people list
  getLikedPeople: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Person>> => {
    try {
      const response = await apiClient.get("/people/liked", {
        params: { page, limit },
      });
      return {
        data: response.data.data || [],
        page: response.data.page || page,
        limit: response.data.limit || limit,
        total: response.data.total || 0,
        hasMore: response.data.hasMore || false,
      };
    } catch (error: any) {
      console.log("Axios liked error:", error.message, error.response?.data);
      throw error;
    }
  },

  likePerson: async (personId: string): Promise<LikeDislikeResponse> => {
    const response = await apiClient.post(`/people/${personId}/like`);
    return response.data;
  },

  dislikePerson: async (personId: string): Promise<LikeDislikeResponse> => {
    console.log("personId", personId);
    const response = await apiClient.post(`/people/${personId}/dislike`);
    return response.data;
  },
};

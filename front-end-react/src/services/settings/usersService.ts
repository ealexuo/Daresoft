import { User } from "../../types/User";
import axiosService from "../axios/axiosService";

const BASE_PATH = "api/Users/";

export const usersService = {
  getAll: async (offset: number, fetch: number, searchText: string): Promise<any> => {    
    return await axiosService.get<any>(BASE_PATH, {
      params: {
        Offset: offset.toString(),
        Fetch: fetch.toString(),
        SearchText: searchText,
      },
    });
  },
  add: async (user: User): Promise<any> => {
    return await axiosService.post(BASE_PATH, user);
  },
  edit: async (user: User): Promise<any> => {
    return await axiosService.put(BASE_PATH, user);
  },
  get: async (userId: number): Promise<any> => {
    return await axiosService.get(BASE_PATH + userId);
  },
  delete: async (userId: number): Promise<any> => {
    return await axiosService.delete(BASE_PATH + userId);
  }
};

import axiosService from "../axios/axiosService";

const BASE_PATH = "api/Users/";

export const userService = {
  getAll: async (offset: number, fetch: number, searchText: string): Promise<any> => {    
    return await axiosService.get<any>(BASE_PATH, {
      params: {
        Offset: offset.toString(),
        Fetch: fetch.toString(),
        SearchText: searchText,
      },
    });
  },
  add: async (user: any): Promise<any> => {
    return await axiosService.post(BASE_PATH, user);
  },
  edit: async (entityId: number, userId: number, user: any): Promise<any> => {
    return await axiosService.put(BASE_PATH + entityId + '/' + userId, user);
  },
  get: async (userId: number): Promise<any> => {
    return await axiosService.get(BASE_PATH + userId);
  },
  delete: async (entityId: number, userId: number): Promise<any> => {
    return await axiosService.delete(BASE_PATH + entityId + '/' + userId);
  }
};

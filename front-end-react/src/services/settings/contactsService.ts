import axiosService from "../axios/axiosService";

const BASE_PATH = "api/Contacts/";

export const contactsService = {
  getAll: async (offset: number, fetch: number, searchText: string): Promise<any> => {    
    return await axiosService.get<any>(BASE_PATH, {
      params: {
        Offset: offset.toString(),
        Fetch: fetch.toString(),
        SearchText: searchText,
      },
    });
  },
  // add: async (contact: any): Promise<any> => {
  //   return await axiosService.post(BASE_PATH, contact);
  // },
  // edit: async (entityId: number, userId: number, contact: any): Promise<any> => {
  //   return await axiosService.put(BASE_PATH + entityId + '/' + userId, contact);
  // },
  get: async (contactId: number): Promise<any> => {
    return await axiosService.get(BASE_PATH + contactId);
  },
  // delete: async (entityId: number, userId: number): Promise<any> => {
  //   return await axiosService.delete(BASE_PATH + entityId + '/' + userId);
  // }
};

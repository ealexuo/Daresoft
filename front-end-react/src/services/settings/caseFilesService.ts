import { Contact } from "../../types/Contact";
import axiosService from "../axios/axiosService";

const BASE_PATH = "api/CaseFiles/";

export const caseFilesService = {
  getAll: async (offset: number, fetch: number, searchText: string): Promise<any> => {    
    return await axiosService.get<any>(BASE_PATH, {
      params: {
        Offset: offset.toString(),
        Fetch: fetch.toString(),
        SearchText: searchText,
      },
    });
  },
  // add: async (contact: Contact): Promise<any> => {
  //   return await axiosService.post(BASE_PATH, contact);
  // },
  // edit: async (contact: Contact): Promise<any> => {
  //   return await axiosService.put(BASE_PATH, contact);
  // },
  // get: async (contactId: number): Promise<any> => {
  //   return await axiosService.get(BASE_PATH + contactId);
  // },
  delete: async (caseFileId: number): Promise<any> => {
    return await axiosService.delete(BASE_PATH + caseFileId);
  }
};

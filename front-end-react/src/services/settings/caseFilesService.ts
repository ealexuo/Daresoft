import { CaseFile } from "../../types/CaseFile";
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
  add: async (caseFile: CaseFile): Promise<any> => {
    return await axiosService.post(BASE_PATH, caseFile);
  },
  edit: async (caseFile: CaseFile): Promise<any> => {
    return await axiosService.put(BASE_PATH, caseFile);
  },
  // get: async (contactId: number): Promise<any> => {
  //   return await axiosService.get(BASE_PATH + contactId);
  // },
  delete: async (caseFileId: number): Promise<any> => {
    return await axiosService.delete(BASE_PATH + caseFileId);
  }
};

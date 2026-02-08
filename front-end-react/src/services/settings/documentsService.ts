import { CaseFile } from "../../types/CaseFile";
import { Contact } from "../../types/Contact";
import axiosService from "../axios/axiosService";
import axiosBlobService from "../axios/axiosBlobService";

const BASE_PATH = "api/Documents/";

export const documentsService = {
  // getAll: async (offset: number, fetch: number, searchText: string): Promise<any> => {    
  //   return await axiosService.get<any>(BASE_PATH, {
  //     params: {
  //       Offset: offset.toString(),
  //       Fetch: fetch.toString(),
  //       SearchText: searchText,
  //     },
  //   });
  // },
  // add: async (caseFile: CaseFile): Promise<any> => {
  //   return await axiosService.post(BASE_PATH, caseFile);
  // },
  // edit: async (caseFile: CaseFile): Promise<any> => {
  //   return await axiosService.put(BASE_PATH, caseFile);
  // },
  getReadUrl: async (path: string): Promise<any> => {
    return await axiosService.get(BASE_PATH + 'read-url/' + path);
  },  
  getUploadUrl: async (documentId: number): Promise<any> => {
    return await axiosService.get(BASE_PATH + 'upload-url/' + documentId);
  },
  // delete: async (caseFileId: number): Promise<any> => {
  //   return await axiosService.delete(BASE_PATH + caseFileId);
  // }
  upload: async (file: File, uploadUrl: string) =>
  {
    console.log(uploadUrl);
    return await axiosBlobService.put(uploadUrl, file, {
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': file.type || 'application/octet-stream'
        },
        // IMPORTANT for large files
        maxBodyLength: Infinity,
        maxContentLength: Infinity
        // Optional: track upload progress
        // onUploadProgress: (progressEvent) => {
        //   const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //   setUploadStatus(`Uploading: ${percentCompleted}%`);
        // },
      });      
  }
};

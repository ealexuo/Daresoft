import { Task } from "../../types/Task";
import axiosService from "../axios/axiosService";

const BASE_PATH = "api/Tasks/";

export const tasksService = {
  // getAll: async (offset: number, fetch: number, searchText: string): Promise<any> => {    
  //   return await axiosService.get<any>(BASE_PATH, {
  //     params: {
  //       Offset: offset.toString(),
  //       Fetch: fetch.toString(),
  //       SearchText: searchText,
  //     },
  //   });
  // },
  add: async (task: Task): Promise<any> => {    
    return await axiosService.post(BASE_PATH, task);
  },
  edit: async (task: Task): Promise<any> => {
    return await axiosService.put(BASE_PATH, task);
  },
  get: async (taskId: number): Promise<any> => {
    return await axiosService.get(BASE_PATH + taskId);
  },
  delete: async (taskId: number): Promise<any> => {
    return await axiosService.delete(BASE_PATH + taskId);
  }
};

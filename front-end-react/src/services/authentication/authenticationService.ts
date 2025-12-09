import axiosService from "../axios/axiosService";

const BASE_PATH = "api/Authentication/";

export const authenticationService = {

  ping: async (): Promise<any> => {
      return axiosService.get<any>(BASE_PATH + 'Ping');
  },

  signIn: async(userName: string, password: string): Promise<any> => {    
      const data = {
        userName,
        password
      }
      return await axiosService.post<any>(BASE_PATH + 'signin', data);
  }
};

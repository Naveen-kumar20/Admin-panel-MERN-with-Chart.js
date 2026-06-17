import axios from "axios";
import { store } from "../app/store";
import { setCredentials, clearCredentials} from '../features/authSlice'

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true
});

axiosInstance.interceptors.request.use(
	(config) => {
		const state = store.getState();
		const { accessToken } = state.auth;
		if (accessToken) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

//made this response interceptor to handle expired accessToken situation, it will get the new accessToken using '/refresh' endpoint and update the state with new accessToken and again hit the original request.
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {

        //accessToken expired or unauthorized bcoz of some other reason
		if (error.response?.status == 401 && !error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/signup') && !error.config.url.includes('/auth/refresh')) {
            try {
                //making request for new token
                const res = await axiosInstance.post('/auth/refresh')
                const accessToken = res.data.accessToken;
                //getting the user state to use inside dispatch
                const {user} = store.getState().auth
                
                //setting new accessToken to state
                store.dispatch(setCredentials({user, accessToken}))
    
                //adding the new accessToken to the original request
                error.config.headers.Authorization = `Bearer ${accessToken}`
                //again hitting the original request and returning its result to original calling method.
                return axiosInstance(error.config)
            } catch (refreshError) {
                //if refresh request failed(becoz of invalid refresh token, or old refresh token) clear the cookie
                store.dispatch(clearCredentials())
                return Promise.reject(refreshError)
            }
		}
        return Promise.reject(error)
	},
);

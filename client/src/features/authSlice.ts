import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    user: null | {name: string, email: string},
    accessToken: null | string,
    isAuthenticated: boolean
}
const initialState: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{user:{name:string, email: string} | null, accessToken: string}>)=>{
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.isAuthenticated = true
        },
        clearCredentials: (state)=>{
            state.user = null;
            state.accessToken = null;
            state.isAuthenticated = false
        },
    }
})

export const { setCredentials, clearCredentials } = authSlice.actions

export default authSlice.reducer
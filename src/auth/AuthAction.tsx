import * as authActions from './AuthActionTypes';
import {AxiosError} from "axios";
import http from "../app/Client";
import {Action, AuthResults, IAuthData} from "../app/types";
import {parseJwt} from "../app/utilityFunctions";
import {Dispatch} from "redux";

export const authStart = () => {
    return {
        type: authActions.AUTH_START
    }
}
export const authSuccess = (data: AuthResults): Action<string, AuthResults> => {
    return {
        type: authActions.AUTH_SUCCESS,
        payload: data
    }
}
export const authFail = (error: AxiosError) => {
    return {
        type: authActions.AUTH_FAIL,
        payload: error.message
    }
}
export const logOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expireDate')
    return {type: authActions.AUTH_LOGOUT};
}
export const checkAuthTimeOut = (timeOut: number) => {
    const diff = timeOut * 1000 - new Date().getTime();
    return (dispatch: Dispatch) => {
        setTimeout(() => {
            dispatch(logOut())
        }, diff);
    }
}
export const auth = (data: IAuthData) => {
    return (dispatch: any) => {
        dispatch(authStart())
        http.post('/login', data)
            .then(results => {
                const jwtData = parseJwt(results.headers.authorization);
                localStorage.setItem('token', results.headers.authorization)
                localStorage.setItem('expireDate', new Date(+jwtData.exp * 1000).toString())
                dispatch(authSuccess({
                    token: results.headers.authorization,
                    userId: +jwtData.sub,
                    expireDate: +jwtData.exp
                }))
                dispatch(checkAuthTimeOut(+jwtData.exp))
            }).catch((error) => {
            dispatch(authFail(error))
        })
    }
}
export const authCheckState = () => {
    return (dispatch: any) => {
        const token = localStorage.getItem('token')
        const expireDateString = localStorage.getItem('expireDate')
        if (token && expireDateString) {
            const expireDate = new Date(expireDateString)
            if (expireDate < new Date()) {
                dispatch(logOut())
            } else {
                const jwtData = parseJwt(token);
                dispatch(authSuccess({
                    token: token,
                    userId: +jwtData.sub,
                    expireDate: +jwtData.exp
                }))
                dispatch(checkAuthTimeOut(expireDate.getTime() / 1000))
            }
        } else {
            dispatch(logOut())
        }
    }
}

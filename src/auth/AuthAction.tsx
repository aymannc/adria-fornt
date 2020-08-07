import * as authActions from './AuthActionTypes';
import {AxiosError} from "axios";
import http from "../app/client";
import {Action, AuthResults, IAuthData} from "../shared/types";
import {parseJwt} from "../shared/utilityFunctions";
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
    return {type: authActions.AUTH_LOGOUT};
}
export const checkAuthTimeOut = (timeOut: number) => {
    // console.log(timeOut, new Date().getTime() / 1000, (timeOut - new Date().getTime()) / 1000)
    return (dispatch: Dispatch) => {
        setTimeout(() => {
            dispatch(logOut())
        }, timeOut * 1000 - new Date().getTime());
    }
}
export const auth = (data: IAuthData) => {
    return (dispatch: any) => {
        dispatch(authStart())
        http.post('/login', data)
            .then(results => {
                const jwtData = parseJwt(results.headers.authorization);
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

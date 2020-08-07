import * as authActions from './AuthActionTypes';
import {AxiosError} from "axios";
import http from "../client";
import {Action, AuthResults, IAuthData} from "../shared/types";
import {parseJwt} from "../shared/utilityFunctions";

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
        payload: error
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
                    userId: jwtData?.sub ? +jwtData?.sub : -1,
                    expireDate: jwtData?.exp ? +jwtData?.exp : -1
                }))
            }).catch((error) => {
            dispatch(authFail(error))
        })
    }
}

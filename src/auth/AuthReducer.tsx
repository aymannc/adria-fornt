import * as actions from './AuthActionTypes'
import {AxiosError} from "axios";
import {Action, AuthResults, AuthState, IAuthData} from "../app/types";
import {updateObject} from "../app/utilityFunctions";


const initialState: AuthState = {
    token: undefined,
    userId: undefined,
    expireDate: undefined,
    error: undefined,
    loading: false,
}

const AuthReducer = (state = initialState, action: Action<string, IAuthData | AuthResults | AxiosError>) => {
    switch (action.type) {
        case actions.AUTH_START:
            return updateObject(state, {error: null, loading: true})
        case actions.AUTH_SUCCESS:
            return updateObject(state, {
                token: (action.payload as AuthResults).token,
                userId: (action.payload as AuthResults).userId,
                expireDate: (action.payload as AuthResults).expireDate,
                error: null,
                loading: false
            })
        case actions.AUTH_FAIL:
            return updateObject(state, {...initialState, error: action.payload})
        case actions.AUTH_LOGOUT:
            return updateObject(state, {...initialState})
        default:
            return state
    }
}
export default AuthReducer;

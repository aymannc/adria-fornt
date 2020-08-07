import * as actions from './AuthActionTypes'
import {AxiosError} from "axios";
import {Action, AuthResults, IAuthData} from "../shared/types";
import {updateObject} from "../shared/utilityFunctions";


const initialState = {
    token: null,
    userId: null,
    expireDate: null,
    error: null,
    loading: null,
}

const AuthReducer = (state = initialState, action: Action<string, IAuthData | AuthResults | AxiosError>) => {
    switch (action.type) {
        case actions.AUTH_START:
            return updateObject(state, {error: null, loading: true})
        case actions.AUTH_SUCCESS:
            console.log(action.payload)
            return updateObject(state, {
                token: (action.payload as AuthResults).token,
                userId: (action.payload as AuthResults).userId,
                expireDate: (action.payload as AuthResults).expireDate,
                error: null,
                loading: false
            })
        case actions.AUTH_FAIL:
            return updateObject(state, {error: action.payload, loading: false})
        default:
            return state
    }
}
export default AuthReducer;

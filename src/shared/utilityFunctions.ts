import {JWTData} from "./types";

export const updateObject = (oldState: any, updatedPropreties: any) => {
    return {
        ...oldState,
        ...updatedPropreties
    }
}
export const parseJwt = (token: string): JWTData | null => {
    if (!token) {
        return null;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

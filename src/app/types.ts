export interface IAuthData {
    username: string;
    password: string;
}

export interface AuthResults {
    token: string;
    userId: number;
    expireDate: number;
}

export interface Action<T, P> {
    readonly type: T;
    readonly payload?: P;
}

export interface JWTData {
    exp: number
    roles: string[]
    sub: string
}

export interface AuthState {
    token?: string,
    userId?: number,
    expireDate?: number,
    error?: string,
    loading: boolean,
}

export interface GlobalState {
    auth: AuthState,
}

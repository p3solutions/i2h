
export class NotificationObject {
    message: string;
    classCss: string;
    show: boolean;
}

export interface TokenResponse {
    token: string;
}

export interface TokenPayload {
    _id: string;
    email: string;
    password?: string;
    otp?: string;
    fname?: string;
    lname?: string;
    mobile?: string;
    dob?: string;
    sex?: string;
}

export interface UserDetails {
    _id: string;
    email: string;
    fname: string;
    password: string;
    lname: string;
    mobile: string;
    dob: string;
    sex: string;
    exp: number;
    iat: number;
}

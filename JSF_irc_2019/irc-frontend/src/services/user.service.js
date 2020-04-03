import User from "../models/user";
import {__emitter} from "../main";

export const LOGIN = "login";
export const LOGOUT = "logout";
export const LOGIN_CALLBACK = "LOGIN_CALLBACK";
export const LOGOUT_CALLBACK = "LOGOUT_CALLBACK";

export default class UserService {

    socket = null;

    constructor(socket) {
        this.socket = socket;
    }

    listen() {
        this.listenUIEvents();
        this.listenServiceEvents();
    }

    listenServiceEvents = () => {
        this.socket
            .on(LOGIN, this.loginCallback)
            .on(LOGOUT, this.logoutCallback)
    };

    listenUIEvents = () => {
        __emitter
            .$on(LOGIN, (user) => this.login(user))
            .$on(LOGOUT, () => this.logout());
    };

    login = (user) => {
        this.user = User.from(user);
        this.socket.emit(LOGIN, {username: user.name});
    };

    logout = () => {
        this.socket.emit(LOGOUT, {username: this.user.name});
    };

    loginCallback = ({status}) => {
        this.user = status === "User connected" ? this.user : null;
        __emitter.$emit(LOGIN_CALLBACK, this.user);
    };

    logoutCallback = (status) => {
        this.user = status === "disconnected" ? this.user : null;
        __emitter.$emit(LOGOUT_CALLBACK, this.user);
    }
}
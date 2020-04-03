import {__emitter} from "../main";
import Message from "../models/message";

export const MESSAGE = "message";
export const MESSAGE_CALLBACK = "MESSAGE_CALLBACK";
export const TYPING = "TYPING";
export const TYPING_CALLBACK = "TYPING_CALLBACK";

export default class MessageService {

    socket;

    constructor( socket) {
        this.socket = socket;
    }

    listen = () => {
        this.listenServiceEvents();
        this.listenUIEvents();
    };

    listenServiceEvents = () => {
        __emitter
            .$on(MESSAGE_CALLBACK, this.messageCallback);
        this.socket
            .on(MESSAGE, this.messageCallback);
    };

    listenUIEvents = () => {
        __emitter
            .$on(MESSAGE, this.message)
            .$on(TYPING, this.typing);
    };

    message = (message, channel) => {
        this.socket.emit(MESSAGE, {...message, channel: channel.channel_name});
        __emitter.$emit(MESSAGE_CALLBACK, message, channel)
    };

    messageCallback = (message, channel) => {
        const object = Message.from({
            id: channel.messages.length + 1,
            user: message.username,
            content: message.message
        });
        //channel.messages.push(object);
        return object;
    };

    typing = (channel, user) => {
        __emitter.$emit(TYPING_CALLBACK, channel, user)
    };
}
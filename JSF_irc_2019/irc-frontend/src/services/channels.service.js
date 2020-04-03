import {__emitter} from "../main";
import Channel from "../models/channel";
import Message from "../models/message";

export const GET_CHANNELS = "get channels";
export const GET_CHANNELS_CALLBACK = "GET_CHANNELS_CALLBACK";
export const GET_MESSAGES = "get messages";
export const GET_MESSAGES_CALLBACK = "GET_MESSAGES_CALLBACK";
export const LEAVE = "LEAVE";
export const LEAVE_CALLBACK = "LEAVE_CALLBACK";
export const JOIN = "JOIN";
export const JOIN_CALLBACK = "JOIN_CALLBACK";
export const CREATE = "create channel";
export const CREATE_CALLBACK = "CREATE_CALLBACK";
export const DROP = "DROP";
export const DROP_CALLBACK = "DROP_CALLBACK";
export const RENAME = "RENAME";
export const RENAME_CALLBACK = "RENAME_CALLBACK";
export const ACTIVE = "ACTIVE";

export default class ChannelService {

    channels;
    socket;
    newChannel = null;
    saveChannel = null;

    constructor(socket, channels) {
        this.socket = socket;
        this.channels = channels;
    }

    listen = () => {
        this.listenServiceEvents();
        this.listenUIEvents();
    };

    listenServiceEvents = () => {
        __emitter
            .$on(JOIN_CALLBACK, this.joinCallback)
            .$on(LEAVE_CALLBACK, this.leaveCallback)
            .$on(DROP_CALLBACK, this.dropCallback)
            .$on(RENAME_CALLBACK, this.renameCallback)
            .$on(RENAME_CALLBACK, this.renameCallback);
        this.socket
            .on(GET_CHANNELS, this.getCallback)
            .on(CREATE, this.createCallback)
            .on(GET_MESSAGES, this.getMessagesCallback);
    };

    listenUIEvents = () => {
        __emitter
            .$on(LEAVE, this.leave)
            .$on(JOIN, this.join)
            .$on(CREATE, this.create)
            .$on(DROP, this.drop)
            .$on(RENAME, this.rename)
            .$on(ACTIVE, this.active)
            .$on(GET_MESSAGES, this.getMessages)
    };

    getChannels = () => {
        this.socket.emit(GET_CHANNELS);
    };

    getCallback = ({channels}) => {
        let models = [];

        channels.forEach(channel => models.push(Channel.from(channel)));
        __emitter.$emit(GET_CHANNELS_CALLBACK, models)
    };

    getMessages = (channel) => {
        this.saveChannel = channel;
        this.socket.emit(GET_MESSAGES, {channel: channel.channel_name});
    };

    getMessagesCallback = ({messages}) => {
        let models = [];

        messages.forEach(message => models.push(Message.from(message)));
        this.saveChannel.messages = messages;
    };

    join = channel => {
        __emitter.$emit(JOIN_CALLBACK, channel);
    };

    joinCallback = channel => {
        if (this.channels.recent.indexOf(channel) === -1)
            this.channels.recent.unshift(channel);
        if (this.channels.recent.length > 3) this.channels.recent.pop();
        if (this.channels.joined.indexOf(channel) !== -1) return;
        this.getMessages(channel);
        this.channels.joined.push(channel);
        __emitter.$emit(ACTIVE, channel);
        this.socket.on(channel.channel_name, ({user, message}) => channel.messages.push(Message.from({
            user: user,
            content: message,
            id: `temporary-${channel.messages.length + 1}`
        })));
    };

    leave = channel => {
        __emitter.$emit(LEAVE_CALLBACK, channel);
    };

    leaveCallback = channel => {
        this.channels.joined.splice(this.channels.joined.indexOf(channel), 1);
    };

    create = (channel) => {
        this.newChannel = Channel.from({
            ...channel,
            messages: [],
            id: this.channels.all.length + 1
        });
        this.socket.emit(CREATE, {channel: channel.channel_name})
    };

    createCallback = ({status}) => {
        const channel = this.newChannel;
        if (status === "channel creation failed, channel already exists") {
            __emitter.$emit(CREATE_CALLBACK, {success: false, message: 'this channel already exists'})
        } else {
            this.channels.all.unshift(channel);
            this.join(channel);
            __emitter.$emit(CREATE_CALLBACK, {success: true, message: 'channel added'})
        }
    };

    drop = channel => {
        __emitter.$emit(DROP_CALLBACK, channel);
    };

    dropCallback = channel => {
        this.leave(channel);
        this.channels.all.splice(this.channels.all.indexOf(channel), 1);
    };

    rename = (channel, name) => {
        __emitter.$emit(RENAME_CALLBACK, channel, name);
    };

    renameCallback = (channel, name) => {
        channel.name = name;
    };

    active = channel => {
        this.channels.active = channel
    }
}
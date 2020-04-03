import Message from "./message";

export default class Channel {
    id = -1;
    owner = '';
    messages = [];
    channel_name = '';

    constructor(id, owner, channel_name, messages) {
        this.id = id;
        this.owner = owner;
        this.channel_name = name;
        for (const message in messages) {
            this.messages.push(Message.from(message));
        }
    }

    static from(json){
        return Object.assign(new Channel(), json);
    }
}
export default class Message {
    id;
    username;
    content;

    constructor(id, username, content) {
        this.id = id;
        this.username = username;
        this.content = content;
    }

    static from(json){
        return Object.assign(new Message(), json);
    }
}
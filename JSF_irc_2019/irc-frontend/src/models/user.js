export default class User {
    id;
    name;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    static from(json){
        return Object.assign(new User(), json);
    }
}
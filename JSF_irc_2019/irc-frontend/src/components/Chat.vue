<template>
    <div class="chat-container" v-bind:id="`channel-${channel.id}`">
        <div class="chat-content">
            <div v-for="(message, index) in channel.messages"
                v-bind:key="message.id"
            >
                <div
                    v-if="user"
                    v-bind:class="message.user === user.name ? 'mine messages' : 'yours messages'"
                >
                    <span
                        v-if="message.user !== user.name && (index === 0 || message.user !== channel.messages[index - 1].user)"
                        class="message-owner">
                        {{message.user}}
                    </span>
                    <div class="message" v-bind:class="message.user === user.name ? 'primary message' : 'message'">
                        <span>{{message.content}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {__emitter} from "../main";
    import {MESSAGE} from "../services/messages.service";

    export default {
        name: "chat",
        created() {
            __emitter.$on(MESSAGE, () => {
                setTimeout(() => {
                    const scrollContainer = document.getElementById(`channel-${this.channel.id}`);
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }, 300);
            })
        },
        props: ['channel', 'user']
    }
</script>

<style scoped lang="sass">

    .chat-container
        max-height: 100vh
        overflow: auto
        width: 100%
        height: 80vh
        scroll-behavior: smooth

    .chat-content
        margin-bottom: 70px

    .messages
        display: flex
        flex-direction: column
        align-items: center
        align-content: center

        .message-owner
            font-size: 12px
            color: gray
            text-align: start
            margin-left: 32px
            margin-top: 16px

    .message
        border-radius: 20px
        padding: 8px 16px
        margin: 4px 16px 4px 16px
        color: white
        display: flex
        flex-direction: column

    .yours
        align-items: flex-start

    .yours .message
        margin-right: 25%
        background-color: #626262
        position: relative

    .yours .message.last:before
        content: ""
        position: absolute
        z-index: 0
        bottom: 0
        left: -7px
        height: 20px
        width: 20px
        background: #9e9e9e
        border-bottom-right-radius: 15px

    .yours .message.last:after
        content: ""
        position: absolute
        z-index: 1
        bottom: 0
        left: -10px
        width: 10px
        height: 20px
        background: #9e9e9e
        border-bottom-right-radius: 10px

    .mine
        align-items: flex-end

    .mine .message
        color: white
        margin-left: 25%
        background: #212121
        position: relative

    .mine .message.last:before
        content: ""
        position: absolute
        z-index: 0
        bottom: 0
        right: -8px
        height: 20px
        width: 20px
        background: #212121
        border-bottom-left-radius: 15px

    .mine .message.last:after
        content: ""
        position: absolute
        z-index: 1
        bottom: 0
        right: -10px
        width: 10px
        height: 20px
        background: #424242
        border-bottom-left-radius: 10px

</style>
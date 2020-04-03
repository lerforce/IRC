<template>
    <div class="channel-bottom">
        <div class="notifications" v-bind:hidden="!isTyping">
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        </div>
        <div class="controls primary">
            <v-form novalidate @submit="submitMessage">
                <v-text-field
                    v-model="message"
                    :append-outer-icon="message ? 'mdi-send' : 'mdi-microphone'"
                    clear-icon="mdi-close-circle"
                    clearable
                    label="Message"
                    type="text"
                    color="white"
                    v-bind:disabled="channel === null"
                    dark
                    @click:append-outer="submitMessage"
                    @click:clear="clearMessage"
                    @input="onMessageInput"
                >
                 <template v-slot:prepend>
                    <channel-options v-bind:channel="channel" v-bind:user="user"/>
                 </template>
                </v-text-field>
            </v-form>
        </div>
    </div>
</template>

<script>
    import ChannelOptions from "./ChannelOptions";
    import { __emitter } from "../main";
    import {MESSAGE, TYPING, TYPING_CALLBACK} from "../services/messages.service";

    export default {
        name: "ChannelControls",
        components: {ChannelOptions},
        props: ['channel', 'user'],
        data: () => ({
            message: '',
            menu: false,
            isTyping: false,
            timer: null
        }),
        methods: {
            clearMessage() {
                this.message = ''
            },
            submitMessage(event) {
                event.preventDefault();
                __emitter.$emit(MESSAGE, {username: this.user.name, message: this.message}, this.channel);
                this.message = '';
            },
            onMessageInput () {
                __emitter.$emit(TYPING, this.channel, this.user);
            }
        },
        created() {
            __emitter.$on(TYPING_CALLBACK, () => {
                // console.log(channel, user);
                this.isTyping = true;
                if (this.timer != null) clearTimeout(this.timer);
                this.timer = setTimeout(() => this.isTyping = false, 1000)
            })
        }
    }
</script>

<style scoped lang="sass">
    .channel-bottom
        position: fixed
        bottom: 0
        width: calc(100% - 256px)

        .controls
            border-top-left-radius: 4px
            border-top-right-radius: 4px
            padding-top: 16px
            padding-left: 16px
            padding-right: 16px

        .notifications
            margin-bottom: 16px
            font-size: 14px
            text-align: center

    @media (min-width: 1264px)
        .channel-bottom
            width: calc(100% - 312px)

    .spinner
        margin: 100px auto 0
        width: 70px
        text-align: center

    .spinner > div
        width: 18px
        height: 18px
        background-color: #333
        border-radius: 100%
        display: inline-block
        -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both
        animation: sk-bouncedelay 1.4s infinite ease-in-out both

    .spinner .bounce1
        -webkit-animation-delay: -0.32s
        animation-delay: -0.32s

    .spinner .bounce2
        -webkit-animation-delay: -0.16s
        animation-delay: -0.16s

    @-webkit-keyframes sk-bouncedelay
        0%, 80%, 100%
            -webkit-transform: scale(0)
        40%
            -webkit-transform: scale(1.0)

    @keyframes sk-bouncedelay
        0%, 80%, 100%
            -webkit-transform: scale(0)
            transform: scale(0)
        40%
            -webkit-transform: scale(1.0)
            transform: scale(1.0)
</style>
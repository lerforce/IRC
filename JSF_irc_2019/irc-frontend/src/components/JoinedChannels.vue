<template>
    <div>
        <v-tabs
            v-model="active"
            show-arrows
            @change="setActive"
            height="55"
        >
            <v-tab
                v-for="channel in channels"
                :key="channel.id"
            >
                {{ channel.channel_name }}
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="active">
            <v-tab-item
                v-for="channel in channels"
                :key="channel.id"
            >
                <channel v-bind:channel="channel" v-bind:user="user"></channel>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
    import Channel from "./Channel";
    import { __emitter } from '../main'
    import {ACTIVE} from "../services/channels.service";

    export default {
        name: "JoinedChannels",
        props: ['channels', 'user'],
        components: { Channel },
        data: () => ({
            active: null,
        }),
        methods: {
            setActive (index) {
                __emitter.$emit(ACTIVE, this.channels[index]);
            }
        },
        created() {
            __emitter.$on(ACTIVE, channel => this.active = this.channels.indexOf(channel))
        }
    }
</script>

<style scoped lang="sass">
    .v-tabs-items
        height: 100%
</style>
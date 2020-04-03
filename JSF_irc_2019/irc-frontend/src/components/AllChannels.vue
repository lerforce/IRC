<template>
    <v-navigation-drawer
        app
        permanent
        clipped
        fixed
        right
        class="drawer"
    >
        <v-toolbar flat>
            <v-toolbar-title v-text="'Channels'"/>
        </v-toolbar>

        <v-divider></v-divider>
        <v-list shaped>
            <v-list-group prepend-icon="add" no-action>
                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>New</v-list-item-title>
                    </v-list-item-content>
                </template>
                <v-list-item>
                    <v-list-item-content>
                        <v-form @submit="event => create(event, newChannelName)">
                            <v-text-field
                                v-model="newChannelName"
                                :rules="[() => !!newChannelSuccess || errorMessage, v => v.length >= 3 || 'Min. 3 characters']"
                                type="text"
                                label="Channel name"
                                :append-outer-icon="'add'"
                                @click:append-outer="event => create(event, newChannelName)"
                                @input="newChannelSuccess = true"
                            />
                        </v-form>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>

            <v-divider></v-divider>
            <v-list-group prepend-icon="query_builder" no-action>
                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>Recent</v-list-item-title>
                    </v-list-item-content>
                </template>
                <v-list-item v-for="channel in recent" :key="`recent-${channel.id}`" link  @click="channelClick(channel)">
                    <v-list-item-icon>
                        <v-icon :color="joined.indexOf(channel) !== -1 ? 'primary' : 'grey'">chat_bubble</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ channel.channel_name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>

            <v-divider></v-divider>
            <v-list-group prepend-icon="all_inclusive" no-action value="true">
                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>All</v-list-item-title>
                    </v-list-item-content>
                </template>
                <v-list-item v-for="channel in all" :key="channel.id" link @click="channelClick(channel)">
                    <v-list-item-icon>
                        <v-icon :color="joined.indexOf(channel) !== -1 ? 'primary' : 'grey'">chat_bubble</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>{{ channel.channel_name }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
    import { __emitter } from '../main'
    import {ACTIVE, CREATE, CREATE_CALLBACK, JOIN, LEAVE} from "../services/channels.service";

    export default {
        name: "AllChannels",
        props: ['all', 'joined', 'recent', 'user'],
        methods: {
            channelClick(channel) {
                if (this.joined.indexOf(channel) !== -1) {
                    this.setActive(channel)
                } else {
                    this.join(channel)
                }
            },
            join (channel) {
                __emitter.$emit(JOIN, channel);
            },
            leave (channel) {
                __emitter.$emit(LEAVE, channel);
            },
            setActive (channel) {
                __emitter.$emit(ACTIVE, channel);
            },
            create (event, name) {
                event.preventDefault();
                if (name.length < 3) {
                    this.newChannelSuccess = true;
                    this.errorMessage = 'Min. 3 characters';
                } else {
                    __emitter.$emit(CREATE, {channel_name: name, owner: this.user.name});
                }
            }
        },
        created() {
            __emitter.$on(CREATE_CALLBACK, ({success, message}) =>{
                this.newChannelSuccess = success;
                this.errorMessage = message;
                this.newChannelName = '';
            })
        },
        data: () => ({
            errorMessage: '',
            newChannelSuccess: true,
            newChannelName: '',
        }),
        computed: {

        },
    }
</script>

<style scoped lang="sass">
    .drawer
        margin-top: 56px
</style>
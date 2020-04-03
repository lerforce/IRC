<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="200"
        offset-x
    >
        <template v-slot:activator="{ on }">
            <v-icon
                v-bind:disabled="channel === null"
                v-on="on">
                {{ !menu?'more_vert':'cancel'}}
            </v-icon>
        </template>

        <v-card v-if="channel" dark>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-form @submit="event => rename(event, channel, name)">
                            <v-text-field
                                :rules="rules"
                                type="text"
                                label="Rename channel"
                                v-bind:placeholder="channel.name"
                                v-model="name"
                                :append-outer-icon="'create'"
                                @click:append-outer="event => rename(event, channel, name)"
                            >
                            </v-text-field>
                        </v-form>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
            </v-list>

            <v-card-actions>
                <v-btn
                    :disabled="channel.owner !== user.name"
                    class="ma-2 white--text"
                    color="error"
                    @click="drop(channel)"
                >
                    <v-icon right dark>cancel</v-icon>
                    Delete Channel
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn class="ma-2" outlined color="primary"
                    @click="leave(channel)">
                    <v-icon left>exit_to_app</v-icon> Leave
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
    import { __emitter } from "../main";
    import {DROP, LEAVE, RENAME} from "../services/channels.service";

    export default {
        name: "ChannelOptions",
        props: ['channel', 'user'],
        data: () => ({
            name: '',
            menu: false,
            rules: [v => v.length >= 3 || 'Min. 3 characters'],
        }),
        methods: {
            getMinifiedName (name) {
                const words = name.split(' ');
                let minified = `${words[0].charAt(0)}`;

                return words.length > 1 ?
                    minified + words[1].charAt(0) :
                    minified + words[0].charAt(1);
            },
            rename(event, channel, name) {
                event.preventDefault();
                if (name.length >= 3)
                    __emitter.$emit(RENAME, channel, name)
            },
            leave(channel) {
                this.menu = false;
                __emitter.$emit(LEAVE, channel)
            },
            drop(channel) {
                this.menu = false;
                __emitter.$emit(DROP, channel)
            }
        }
    }
</script>

<style scoped>

</style>
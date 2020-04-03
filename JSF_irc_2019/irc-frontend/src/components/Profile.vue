<template>
    <v-navigation-drawer
        v-model="show"
        class="drawer"
        app
        expand-on-hover
        clipped
    >
        <v-list-item class="px-2" v-if="user">
            <v-list-item-avatar color="primary">
                <span v-text="getMinifiedName()"></span>
            </v-list-item-avatar>
            <v-list-item-title v-text="user.name"/>
        </v-list-item>

        <v-divider></v-divider>

        <v-list>
            <v-list-item link>
                <v-list-item-icon>
                    <v-icon>contacts</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Contacts</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-group prepend-icon="settings" no-action>
                <template v-slot:activator>
                    <v-list-item-content>
                        <v-list-item-title>Options</v-list-item-title>
                    </v-list-item-content>
                </template>
                <v-list-item>
                    <v-list-item-content>
                        <v-switch
                            v-model="$vuetify.theme.dark"
                            hide-details
                            inset
                            label="Theme Dark"
                            style="margin-left: 16px;"
                        />
                    </v-list-item-content>
                </v-list-item>
            </v-list-group>
        </v-list>
        <template v-slot:append>
            <v-list style="margin-bottom: 56px">
                <v-divider></v-divider>
                <v-list-item link @click="logout">
                    <v-list-item-icon>
                        <v-icon color="error">exit_to_app</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="error--text">Logout</v-list-item-title>
                </v-list-item>
            </v-list>
        </template>
    </v-navigation-drawer>
</template>

<script>
    import {__emitter} from "../main";
    import {LOGIN_CALLBACK, LOGOUT} from "../services/user.service";

    export default {
        name: "Profile",
        data: () => ({
            show: true,
            user: null
        }),
        created() {
            __emitter.$on('toggle-profile', () => this.show = !this.show);
            __emitter.$on(LOGIN_CALLBACK, (user) => this.user = user)
        },
        methods: {
            logout () {
                __emitter.$emit(LOGOUT, this.user);
                this.user = null;
            },
            getMinifiedName () {
                const { name } = this.user;
                let minified = name.charAt(0);
                let split = name.split(' ');

                return split.length > 1 ?
                    minified + split[1].charAt(0) :
                    minified + name.charAt(1)
            }
        }
    }
</script>

<style scoped lang="sass">
    .drawer
        margin-top: 56px
</style>
<template>
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        class="login-container"
    >
        <v-toolbar color="primary">
            <v-btn icon dark @click="dialog = false" disabled>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-card v-bind:loading="loading">
            <v-card-title class="d-flex justify-center">
                <h2>Welcome on IRC</h2>
            </v-card-title>
            <v-card-subtitle class="d-flex justify-center">
                the remade old school chat
            </v-card-subtitle>
            <v-container class="irc-description">
                <v-card flat>
                    <v-container class="presentation-container">
                        <ul>
                            <li>
                                <p>
                                    Share, chat with people and manage discussion channels
                                    in a peaceful and fully responsive UI.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Authentication and secured connections.
                                </p>
                            </li>
                            <li>
                                <p>
                                    Easy to deploy, this tool is downloaded and built in a few minutes.
                                </p>
                            </li>
                            <li>
                                <p>
                                    And more, IRC is free !
                                </p>
                            </li>
                        </ul>
                    </v-container>
                    <v-divider></v-divider>
                    <v-card-title>Enter your pseudo :</v-card-title>
                    <v-card-subtitle>In order to jump in IRC, please set a pseudo</v-card-subtitle>
                    <v-container>
                        <v-form @submit="event => submit(event)">
                            <v-text-field
                                v-model="name"
                                :error-messages="nameErrors"
                                :rules="[() => !!isNameValid || 'This name is already taken']"
                                :counter="10"
                                label="Pseudo"
                                class="input"
                                required
                                autofocus
                            />
                            <v-btn outlined block color="primary" @click="event => submit(event)" v-bind:loading="loading">Login</v-btn>
                        </v-form>
                    </v-container>
                </v-card>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    import { validationMixin } from 'vuelidate'
    import { required, maxLength } from 'vuelidate/lib/validators';
    import { __emitter } from "../main";
    import {LOGIN, LOGIN_CALLBACK, LOGOUT_CALLBACK} from "../services/user.service";

    export default {
        mixins: [validationMixin],

        validations: {
            name: { required, maxLength: maxLength(10) },
        },

        name: "Login",
        data: () => ({
            name: 'Eloi',
            isNameValid: true,
            dialog: true,
            loading: false
        }),
        computed: {
            nameErrors () {
                const errors = [];
                if (!this.$v.name.$dirty) return errors;
                !this.$v.name.maxLength && errors.push('Pseudo must be at most 10 characters long');
                !this.$v.name.required && errors.push('Pseudo is required.');
                return errors
            },
        },
        methods: {
            submit (event) {
                event.preventDefault();
                this.loading = true;
                __emitter.$emit(LOGIN, {name: this.name});
            },
        },
        created() {
            __emitter.$on(LOGIN_CALLBACK, (user) => {
                this.loading = false;
                this.name = '';
                if (user) this.dialog = false;
                else this.isNameValid = false;
            });
            __emitter.$on(LOGOUT_CALLBACK, () => this.dialog = true)
        }
    }
</script>

<style lang="sass">

    .v-dialog
        overflow: hidden

    .irc-description
        margin-top: 32px

        .input
            margin-bottom: 16px
</style>
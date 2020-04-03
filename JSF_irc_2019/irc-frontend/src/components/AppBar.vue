<template>
    <v-app-bar
        class="primary"
        fixed
        flat
        clipped-left
        dark
        height="56"
    >
        <v-app-bar-nav-icon @click="toggleProfile" class="d-lg-none"/>
        <v-toolbar-title>IRC</v-toolbar-title>
    </v-app-bar>
</template>

<script>
    import { __emitter } from "../main";

    export default {
        name: "AppBar",
        methods: {
            toggleProfile () {
                __emitter.$emit('toggle-profile')
            }
        }
    }
</script>

<style scoped lang="sass">

    @media (min-width: 1264px)
        .menu
            display: none
</style>
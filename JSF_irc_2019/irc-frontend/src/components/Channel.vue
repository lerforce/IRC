<template>
    <div class="channel-container">
        <div class="channel-chat">
            <chat v-bind:channel="channel" v-bind:user="user"></chat>
        </div>
    </div>
</template>

<script>
    import Chat from './Chat'
    export default {
        name: "Channel",
        props: ['channel', 'user'],
        components: {
            Chat
        }
    }
</script>

<style scoped lang="sass">
</style>
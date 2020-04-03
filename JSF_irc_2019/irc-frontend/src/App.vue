<template>
  <v-theme-provider root>
    <v-app>
      <app-bar></app-bar>
      <login></login>
      <profile></profile>
      <all-channels
        v-bind:all="channels.all"
        v-bind:joined="channels.joined"
        v-bind:recent="channels.recent"
        v-bind:user="user"
      />
      <v-content class="content">
        <joined-channels v-bind:channels="channels.joined" v-bind:user="user"/>
        <channel-controls v-bind:channel="channels.active" v-bind:user="user"/>
      </v-content>
    </v-app>
  </v-theme-provider>
</template>

<script>
  import AppBar from "./components/AppBar";
  import AllChannels from "./components/AllChannels";
  import JoinedChannels from "./components/JoinedChannels";
  import {__emitter} from "./main";
  import ChannelControls from "./components/ChannelControls";
  import ChannelService, {GET_CHANNELS_CALLBACK} from "./services/channels.service";
  import MessageService from "./services/messages.service";
  import Profile from "./components/Profile";
  import UserService, {LOGIN_CALLBACK} from "./services/user.service";
  import Login from "./components/Login";
  import io from 'socket.io-client'
  import { host, port } from './config/socket.config'

  const socket = io(`${host}:${port}`);

  export default {
    name: 'App',
    components: {
      Login,
      ChannelControls,
      JoinedChannels,
      AllChannels,
      AppBar,
      Profile
    },
    data: () => ({
      channelService: null,
      messageService: null,
      userService: null,
      channels: {
        all: [],
        joined: [],
        recent: [],
        active: null
      },
      user: null
    }),
    created() {
      this.channelService = new ChannelService(socket, this.channels);
      this.messageService = new MessageService(socket);
      this.userService = new UserService(socket);

      this.channelService.listen();
      this.messageService.listen();
      this.userService.listen();

      this.channelService.getChannels();

      __emitter.$on(LOGIN_CALLBACK, (user) => this.user = user);
      __emitter.$on(GET_CHANNELS_CALLBACK, channels => this.channels.all = channels)
    },
    destroyed() {
      if (this.user) this.userService.logout();
      socket.close()
    }
  };
</script>

<style scoped lang="sass">
  .content
    margin-top: 56px
</style>
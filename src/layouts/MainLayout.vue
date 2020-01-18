<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          v-go-back.single
          class="absolute-left"
          flat
          icon="arrow_back"
          label="Back" />

        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>

        <q-btn
          v-if="!userDetails.userId"
          to="/login"
          class="absolute-right q-pr-sm"
          flat
          icon="account_circle"
          label="Login" />
        <q-btn
          v-else
          @click="logoutUser"
          class="absolute-right q-pr-sm"
          flat
          icon="account_circle">
          Logout<br>
          {{ userDetails.name }}
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="stylus">
  .q-toolbar
    .q-btn
      line-height: 1.2

  .platform-ios
    .q-header
      .q-btn, .q-toolbar__title
        padding-top constant(safe-area-inset-top)
        padding-top env(safe-area-inset-top)
    .q-footer
      padding-bottom constant(safe-area-inset-bottom)
      padding-bottom env(safe-area-inset-bottom)
</style>

<script>
  import { mapState, mapActions } from 'vuex';
  import mixinOtherUserDetails from 'src/mixins/other-user-details.js';

  export default {
    mixins: [mixinOtherUserDetails],
    computed: {
      ...mapState('store', ['userDetails']),
      title() {
        let currentPath = this.$route.fullPath;
        if (currentPath == '/login') {
          return 'Login';
        } else if (currentPath.includes('/chat')) {
          return this.otherUserDetails.name;
        } else {
          return 'SmackChat';
        }
      }
    },
    created() {
      window.addEventListener('beforeunload', this.firebaseSetOffline);
    },
    methods: {
      ...mapActions('store', ['logoutUser', 'firebaseSetOffline'])
    }
  }
</script>

<template>
  <q-page class="flex">
    <q-list bordered class="full-width">
      <q-item v-for="(user, key) in users" :key="key" class="q-my-sm" clickable v-ripple :to="'/chat/' + key">
        <q-item-section avatar>
          <q-avatar :color="user.online ? 'positive' : 'negative'" text-color="white">
            {{ user.name.charAt(0) }}
          </q-avatar>
        </q-item-section>

        <q-item-section class="q-pr-xl">
          <q-item-label>{{ user.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
  import { mapState, mapGetters } from 'vuex';

  export default {
    computed: {
      ...mapState('store', ['userDetails']),
      ...mapGetters('store', ['users'])
    },
    mounted() {
      if (!this.userDetails.userId) {
        this.$router.push('/login');
      }
    }
  }
</script>

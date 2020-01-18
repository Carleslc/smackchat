<template>
  <q-page ref="pageChat" class="flex column page-chat">
    <q-banner v-if="!otherUserDetails.online" class="bg-grey-4 text-center fixed-top">
      {{ otherUserDetails.name }} is offline.
    </q-banner>
    <div class="q-pa-md column col justify-end" :class="{ 'invisible' : !showMessages }">
      <q-chat-message
        v-for="(message, key) in messages"
        :key="key"
        :name="message.from == 'me' ? userDetails.name : otherUserDetails.name"
        :text="[message.text]"
        :sent="message.from == 'me'"
        :bg-color="message.from == 'me' ? 'gray' : 'info'"
      />
    </div>
    <q-footer elevated>
      <q-form
        @submit="sendMessage"
        class="full-width">
        <q-input
          ref="newMessage"
          @blur="scrollToBottom"
          v-model="newMessage"
          class="q-pa-sm"
          bg-color="white"
          outlined
          rounded
          label="Chat">
          <template v-slot:after>
            <q-btn
              @click="sendMessage"
              round
              flat
              type="submit"
              color="white"
              icon="send" />
          </template>
        </q-input>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import mixinOtherUserDetails from 'src/mixins/other-user-details.js';

  export default {
    mixins: [mixinOtherUserDetails],
    data() {
      return {
        newMessage: '',
        showMessages: false
      }
    },
    computed: {
      ...mapState('store', ['messages', 'userDetails'])
    },
    methods: {
      ...mapActions('store', ['firebaseGetMessages', 'firebaseStopGettingMessages', 'firebaseSendMessage']),
      sendMessage() {
        this.firebaseSendMessage({
          message: this.newMessage,
          otherUserId: this.$route.params.otherUserId
        });
        this.clearMessage();
      },
      scrollToBottom() {
        let pageChat = this.$refs.pageChat.$el;
        setTimeout(() => {
          window.scrollTo(0, pageChat.scrollHeight);
          this.showMessages = true;
        }, 20);
      },
      clearMessage() {
        this.newMessage = '';
        this.$refs.newMessage.focus();
      }
    },
    watch: {
      messages: function(val) {
        if (Object.keys(val).length) {
          this.scrollToBottom();
        }
      }
    },
    mounted() {
      this.firebaseGetMessages(this.$route.params.otherUserId);
    },
    destroyed() {
      this.firebaseStopGettingMessages();
    }
  }
</script>

<style lang="stylus">
  .page-chat
    background #ffffff
    &:after
      content ''
      display block
      position fixed
      left 0
      right 0
      top 0
      bottom 0
      z-index 0
      opacity 0.1
      background-image radial-gradient(circle at 100% 150%, silver 24%, white 24%, white 28%, silver 28%, silver 36%, white 36%, white 40%, transparent 40%, transparent),
      radial-gradient(circle at 0    150%, silver 24%, white 24%, white 28%, silver 28%, silver 36%, white 36%, white 40%, transparent 40%, transparent),
      radial-gradient(circle at 50%  100%, white 10%, silver 10%, silver 23%, white 23%, white 30%, silver 30%, silver 43%, white 43%, white 50%, silver 50%, silver 63%, white 63%, white 71%, transparent 71%, transparent),
      radial-gradient(circle at 100% 50%, white 5%, silver 5%, silver 15%, white 15%, white 20%, silver 20%, silver 29%, white 29%, white 34%, silver 34%, silver 44%, white 44%, white 49%, transparent 49%, transparent),
      radial-gradient(circle at 0    50%, white 5%, silver 5%, silver 15%, white 15%, white 20%, silver 20%, silver 29%, white 29%, white 34%, silver 34%, silver 44%, white 44%, white 49%, transparent 49%, transparent)
      background-size 100px 50px
  .q-message
    z-index 1
  .q-banner
    top 50px
    opacity 0.8
    z-index 2
</style>

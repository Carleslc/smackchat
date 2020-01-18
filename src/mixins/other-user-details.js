export default {
  computed: {
    otherUserDetails() {
      let otherUser = this.$store.state.store.users[this.$route.params.otherUserId];
      return otherUser ? otherUser : {};
    }
  }
}

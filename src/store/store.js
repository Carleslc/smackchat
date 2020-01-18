import Vue from 'vue';
import { firebaseAuth, firebaseDb } from 'boot/firebase'

let messagesRef;

const state = {
  userDetails: {},
  users: {},
  messages: {}
}

const mutations = {
  setUserDetails(state, payload) {
    state.userDetails = payload;
  },
  addUser(state, payload) {
    Vue.set(state.users, payload.userId, payload.userDetails);
  },
  updateUser(state, payload) {
    Object.assign(state.users[payload.userId], payload.userDetails);
  },
  addMessage(state, payload) {
    Vue.set(state.messages, payload.messageId, payload.messageDetails);
  },
  clearMessages(state) {
    state.messages = {};
  }
}

const actions = {
  registerUser({}, payload) {
    firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        let userId = firebaseAuth.currentUser.uid;
        firebaseDb.ref('users/' + userId).set({
          name: payload.name,
          email: payload.email,
          online: true
        });
      })
      .catch(error => {
        console.log(error.message);
      });
  },
  loginUser({}, payload) {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        console.log('Logged in');
      })
      .catch(error => {
        console.log(error.message);
      });
  },
  handleAuthStateChanged({ commit, dispatch, state }) {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        // User is logged in
        let userId = firebaseAuth.currentUser.uid;
        firebaseDb.ref('users/' + userId).once('value', snapshot => {
          let userDetails = snapshot.val();
          commit('setUserDetails', {
            name: userDetails.name,
            email: userDetails.email,
            userId: userId
          });
          if (this.$router.currentRoute.path !== '/') {
            this.$router.push('/');
          }
        });
        dispatch('firebaseUpdateUser', {
          userId: userId,
          updates: {
            online: true
          }
        });
        dispatch('firebaseGetUsers');
      } else if (state.userDetails.userId) {
        // User is logged out
        commit('setUserDetails', {});
        this.$router.replace('/login');
      }
    });
  },
  logoutUser({ dispatch }) {
    dispatch('firebaseSetOffline');
    firebaseAuth.signOut();
  },
  firebaseUpdateUser({}, payload) {
    if (payload.userId) {
      firebaseDb.ref('users/' + payload.userId).update(payload.updates);
    }
  },
  firebaseSetOffline({ dispatch, state }) {
    dispatch('firebaseUpdateUser', {
      userId: state.userDetails.userId,
      updates: {
        online: false
      }
    });
  },
  firebaseGetUsers({ commit }) {
    firebaseDb.ref('users').on('child_added', snapshot => {
      let userId = snapshot.key;
      let userDetails = snapshot.val();
      commit('addUser', {
        userId,
        userDetails
      });
    });
    firebaseDb.ref('users').on('child_changed', snapshot => {
      let userId = snapshot.key;
      let userDetails = snapshot.val();
      commit('updateUser', {
        userId,
        userDetails
      });
    });
  },
  firebaseGetMessages({ commit, state }, otherUserId) {
    messagesRef = firebaseDb.ref(`chats/${state.userDetails.userId}/${otherUserId}`);
    messagesRef.on('child_added', snapshot => {
      let messageId = snapshot.key;
      let messageDetails = snapshot.val();
      commit('addMessage', {
        messageId,
        messageDetails
      })
    });
  },
  firebaseStopGettingMessages({ commit }) {
    if (messagesRef) {
      messagesRef.off('child_added');
      commit('clearMessages');
    }
  },
  firebaseSendMessage({ state }, payload) {
    payload.message = payload.message.trim();
    if (payload.message.length > 0) {
      firebaseDb.ref(`chats/${state.userDetails.userId}/${payload.otherUserId}`).push({
        from: 'me',
        text: payload.message
      });
      firebaseDb.ref(`chats/${payload.otherUserId}/${state.userDetails.userId}`).push({
        from: 'them',
        text: payload.message
      });
    }
  }
}

const getters = {
  users: state => {
    let otherUsers = {};
    Object.keys(state.users).filter(key => key !== state.userDetails.userId).forEach(key => {
      otherUsers[key] = state.users[key];
    });
    return otherUsers;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

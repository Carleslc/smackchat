# SmackChat

An example chat app using Firebase, Quasar and Vue.js.

[Live example](https://smackchat-f7d74.firebaseapp.com)

[Full Course](https://www.youtube.com/watch?v=Kfg789g_UTg)

## Install the dependencies
```bash
npm install
```

## Configure Firebase project

Add the following code (with your custom project settings) to `src/boot/firebase-config.js`.

```js
var firebaseConfig = {
  apiKey: "***",
  authDomain: "smackchat-f7d74.firebaseapp.com",
  databaseURL: "https://smackchat-f7d74.firebaseio.com",
  projectId: "smackchat-f7d74",
  storageBucket: "smackchat-f7d74.appspot.com",
  messagingSenderId: "***",
  appId: "***"
};

export {
  firebaseConfig
}
```

## Deploy

### Start the app in development mode (hot-code reloading, error reporting, etc.)

#### Web

```bash
quasar dev
```

#### Desktop

```bash
quasar dev -m electron
```

#### iOS

```bash
quasar dev -m cordova -T ios
```

Require cordova & Xcode.

### Build the app for production

```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).

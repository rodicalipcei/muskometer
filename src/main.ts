import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './styles/main.css';

// Create the app
const app = createApp(App);

// Use router
app.use(router);

// Mount the app
app.mount('#app');

// Log app initialization
console.log(`${import.meta.env.VITE_APP_NAME} initialized.`);
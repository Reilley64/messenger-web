import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const app = initializeApp({
  apiKey: "AIzaSyCwkmrh-WP2FyRjnWEz6BUBaCQnkhl0sW8",
  authDomain: "messenger-436700.firebaseapp.com",
});

export const auth = getAuth(app);

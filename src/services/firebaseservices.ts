import firebase from "firebase/compat/app";
import { auth } from "./firebase";

export class FirebaseServices {
  private isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  constructor() {
    firebase.auth().onAuthStateChanged((user) => {
      this.isAuthenticated = user !== null;
      localStorage.setItem('isAuthenticated', String(this.isAuthenticated));
    });
  }

  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => {
      window.location.hash = "home";
    });
  }

  logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.hash = "login";
      })
      .catch((error) => {
        console.log("There was an error when disconnecting an user", error);
      });
  }

  userIsAuthenticated() {
    return this.isAuthenticated || firebase.auth().currentUser !== null;
  }
  

  requireAuth(handler: () => void) {
    return () => {
      if (this.userIsAuthenticated()) {
        handler();
      } else {
        window.location.replace("#login");
      }
    };
  }
}

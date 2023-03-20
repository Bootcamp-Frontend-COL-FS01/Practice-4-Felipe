import firebase from "firebase/compat/app";
import { auth } from "../../services/firebase";
import LoginHtml from "./login.html";
import "./login.scss";

export class Login {
  loginBtn: HTMLElement | null = null;

  render(viewport: HTMLDivElement | null) {
    if (viewport) {
      viewport.innerHTML = LoginHtml;
    }
    this.loginBtn = document.getElementById("google-login");
    this.loginBtn?.addEventListener("click", this.loginWithGoogle);
  }

  loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(() => {
      window.location.hash = "home";
    });
  }
}

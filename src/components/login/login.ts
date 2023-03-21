import { FirebaseServices } from "./../../services/firebaseservices";
import LoginHtml from "./login.html";
import "./login.scss";

export class Login {
  loginBtn: HTMLElement | null = null;
  services: FirebaseServices;

  constructor() {
    this.services = new FirebaseServices();
  }

  render(viewport: HTMLDivElement | null) {
    if (viewport) {
      viewport.innerHTML = LoginHtml;
    }
    this.loginBtn = document.getElementById("google-login");
    this.loginBtn?.addEventListener("click", () => this.services.loginWithGoogle());
  }
}

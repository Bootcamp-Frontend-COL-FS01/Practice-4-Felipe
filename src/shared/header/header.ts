import { FirebaseServices } from "./../../services/firebaseservices";
import headerHtml from "./header.html";
import './header.scss'

export class Header {
  logoutBtn: HTMLElement | null = null;
  services: FirebaseServices;
  constructor() {
    this.services = new FirebaseServices();
  }
  render(viewport: HTMLDivElement | null) {
    if (viewport) {
      viewport.innerHTML = headerHtml;
    }
    this.logoutBtn = document.getElementById("logout");
    this.logoutBtn?.addEventListener("click", () => this.services.logout());
  }
}

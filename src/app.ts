import { Home } from "./components/home/home";
import { RouteManager } from "./route-manager";
import { Login } from "./components/login/login";
import firebase from "firebase/compat/app";

export class App {
  private app: HTMLElement | null;
  private routeManager: RouteManager;
  private login: Login;
  private home: Home;

  constructor() {
    this.routeManager = new RouteManager();
    this.login = new Login();
    this.home = new Home();
    this.onContentLoaded = this.onContentLoaded.bind(this);
    this.app = document.getElementById("app");
    document.addEventListener("DOMContentLoaded", this.onContentLoaded);
  }

  userIsAuthenticated() {
    const currentUser = firebase.auth().currentUser;
    return currentUser !== null;
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

  onContentLoaded() {
    this.routeManager.addRoute("login", () =>
      this.login.render(this.app as HTMLDivElement)
    );
    const homeHandler = () => this.home.render(this.app as HTMLDivElement);

    this.routeManager.addRoute("home", this.requireAuth(homeHandler));
    this.routeManager.onHashChange();
  }
}

import { RouteManager } from "./route-manager";
import { Login } from "./components/login/login";

export class App {
  private app: HTMLElement | null;
  private routeManager: RouteManager;
  private login: Login;

  constructor() {
    this.routeManager = new RouteManager();
    this.login = new Login();
    this.onContentLoaded = this.onContentLoaded.bind(this);
    this.app = document.getElementById("app");
    document.addEventListener("DOMContentLoaded", this.onContentLoaded);
  }

  onContentLoaded() {
    this.routeManager.addRoute("#", () => console.log("Home"));
    this.routeManager.addRoute("login", () => this.login.render(this.app as HTMLDivElement));
    this.routeManager.onHashChange();
  }
}

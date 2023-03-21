import { FirebaseServices } from "./services/firebaseservices";
import { Home } from "./components/home/home";
import { RouteManager } from "./route-manager";
import { Login } from "./components/login/login";

export class App {
  private app: HTMLElement | null;
  private routeManager: RouteManager;
  private login: Login;
  private home: Home;
  private services: FirebaseServices;

  constructor() {
    this.routeManager = new RouteManager();
    this.login = new Login();
    this.home = new Home();
    this.services = new FirebaseServices();
    this.onContentLoaded = this.onContentLoaded.bind(this);
    this.app = document.getElementById("app");
    document.addEventListener("DOMContentLoaded", this.onContentLoaded);
  }

  onContentLoaded() {
    this.routeManager.addRoute("login", () =>
      this.login.render(this.app as HTMLDivElement)
    );
    const homeHandler = () => this.home.render(this.app as HTMLDivElement);

    this.routeManager.addRoute("home", this.services.requireAuth(homeHandler));
    this.routeManager.onHashChange();
  }
}

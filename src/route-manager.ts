export class RouteManager {
  private routes: { [key: string]: () => void };

  constructor() {
    this.routes = {};
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  onHashChange() {
    const route = window.location.hash.slice(1) || "#";
    if (route in this.routes) {
      this.routes[route]();
    } else {
      console.log("La ruta no existe en this.routes");
      window.location.replace("#");
    }
  }

  addRoute(route: string, handler: () => void) {
    this.routes[route] = handler;
  }
}

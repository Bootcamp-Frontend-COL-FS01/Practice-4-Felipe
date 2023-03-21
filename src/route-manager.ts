import firebase from "firebase/compat/app";

export class RouteManager {
  private routes: { [key: string]: () => void };

  constructor() {
    this.routes = {};
    window.addEventListener("hashchange", this.onHashChange.bind(this));
  }

  onHashChange() {
    const route = window.location.hash.slice(1) || "login";
    if (route === "login") {
      firebase
        .auth()
        .signOut()
        .then(() => {
          console.log("Usuario desconectado");
        })
        .catch((error) => {
          console.log("Ocurrió un error al desconectar al usuario:", error);
        });
    }
    if (route in this.routes) {
      this.routes[route]();
    } else {
      console.log("La ruta no existe en this.routes");
      window.location.replace("#login");
    }
  }

  addRoute(route: string, handler: () => void) {
    this.routes[route] = handler;
  }
}

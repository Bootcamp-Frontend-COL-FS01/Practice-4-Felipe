import HomeHtml from "./home.html";
import firebase from "firebase/compat/app";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase, set, ref as refDb } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import "./home.scss";

export class Home {
  logoutBtn: HTMLElement | null = null;
  createPostForm: HTMLElement | null = null;
  userId: string = "";
  imagesUrls: string[] = [];

  render(viewport: HTMLDivElement | null) {
    if (viewport) {
      viewport.innerHTML = HomeHtml;
    }
    this.logoutBtn = document.getElementById("logout");
    this.createPostForm = document.getElementById("create-post");
    console.log(this.createPostForm);
    this.logoutBtn?.addEventListener("click", () => this.handleLogout());
    this.createPostForm?.addEventListener("submit", (event: Event) =>
      this.handleSubmit(event)
    );
  }

  handleLogout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.hash = "login";
      })
      .catch((error) => {
        console.log("Ocurrió un error al desconectar al usuario:", error);
      });
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        this.userId = uid;
      } else {
        console.log("User is signed out");
      }
    });
    const dropZone = document.getElementById(
      "dropzone-file"
    ) as HTMLInputElement;
    const message = document.getElementById("message") as HTMLInputElement;

    const dropZoneFiles = dropZone.files;
    const messageValue = message.value;

    const db = getDatabase();
    const storage = getStorage();

    if (dropZoneFiles && dropZoneFiles.length > 0) {
      for (const file of dropZoneFiles) {
        const image = ref(storage, file.name);
        const imagesRef = ref(storage, `images/${file.name}`);

        image.name === imagesRef.name;
        imagesRef.fullPath === imagesRef.fullPath;

        await uploadBytes(imagesRef, file);
      }
    } else {
      console.log("It is void");
    }
    listAll(ref(storage, "images"))
      .then((res) => {
        const filesUrlsPromises: any = [];
        res.items.forEach((item) => {
          filesUrlsPromises.push(getDownloadURL(item));
        });
        Promise.all(filesUrlsPromises).then((values) => {
          set(refDb(db, "posts/" + uuidv4()), {
            images: JSON.stringify(values),
            userText: messageValue,
            userId: this.userId,
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

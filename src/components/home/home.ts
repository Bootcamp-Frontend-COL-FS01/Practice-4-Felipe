import { Header } from "./../../shared/header/header";
import { Post } from "./components/post/post";
import HomeHtml from "./home.html";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getDatabase,
  set,
  ref as refDb,
  get,
  update,
  remove,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import "./home.scss";

export class Home {
  headerContainer: HTMLElement | null = null;
  editBtnTest: HTMLElement | null = null;
  createPostForm: HTMLElement | null = null;
  postsContainer: HTMLElement | null = null;
  postText: NodeListOf<HTMLElement> | null = null;
  postImages: NodeListOf<HTMLElement> | null = null;
  editBtn: NodeListOf<HTMLElement> | null = null;
  deleteBtn: NodeListOf<HTMLElement> | null = null;
  postSection: NodeListOf<HTMLElement> | null = null;
  userId: string = "";
  dbKeyValues: string[] = [];
  postUserId: string = "";
  usersIds: string[] = [];
  imagesUrls: string[] = [];
  userText: string[] = [];
  userImages: string[][] = [];
  post: Post;
  header: Header;

  constructor() {
    this.post = new Post();
    this.header = new Header();
  }

  render(viewport: HTMLDivElement | null) {
    if (viewport) {
      viewport.innerHTML = HomeHtml;
    }
    this.postsContainer = document.getElementById("posts");
    this.headerContainer = document.getElementById("header");
    this.createPostForm = document.getElementById("create-post");
    this.header.render(this.headerContainer as HTMLDivElement);
    this.createPostForm?.addEventListener("submit", (event: Event) =>
      this.handleSubmit(event)
    );
    this.handlePosts();
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

        await uploadBytes(imagesRef, file).then(async () => {
          const downloadUrl = await getDownloadURL(imagesRef);
          this.imagesUrls.push(downloadUrl);
          this.imagesUrls.flat();
        });
      }
      set(refDb(db, "posts/" + uuidv4()), {
        images: JSON.stringify(this.imagesUrls),
        userText: messageValue,
        userId: this.userId,
      }).then(() => {
        const formElement = event.target as HTMLFormElement;
        formElement.reset();
        this.imagesUrls = [];
        this.postsContainer!.innerHTML = "";
        this.handlePosts();
      });
    } else {
      console.log("It is void");
    }
  }

  handlePosts() {
    const db = getDatabase();
    const query = refDb(db, "posts");
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        this.postUserId = uid;
      } else {
        console.log("User is signed out");
      }
    });
    get(query).then((snapshot) => {
      if (snapshot.exists()) {
        const values = snapshot.val();
        for (const value in values) {
          this.post.render(this.postsContainer as HTMLDivElement);
          this.postText = document.querySelectorAll(".post-text");
          this.postImages = document.querySelectorAll(".post-images");
          this.editBtn = document.querySelectorAll("#edit-btn");
          this.deleteBtn = document.querySelectorAll("#delete-btn");
          this.postSection = document.querySelectorAll(".post-section");
          this.userText.push(values[value].userText);
          this.userImages.push(JSON.parse(values[value].images));
          this.usersIds.push(values[value].userId);
          this.dbKeyValues.push(value);
        }
        this.postText!.forEach((text, index) => {
          text.textContent = this.userText[index];
          this.userImages[index].forEach((userImage) => {
            const image = document.createElement("img");
            image.classList.add("mx-5");
            image.setAttribute("src", userImage);
            this.postImages![index].appendChild(image);
          });
          for (let i = 0; i < this.editBtn!.length; i++) {
            if (this.postUserId !== this.usersIds[i] && i === index) {
              this.editBtn![i].classList.add("hidden");
              this.deleteBtn![i].classList.add("hidden");
            } else {
              this.deleteBtn![i].addEventListener("click", () => {
                if (this.postUserId === this.usersIds[i]) {
                  const postRef = refDb(db, `posts/${this.dbKeyValues[i]}`);
                  remove(postRef).then(() => {
                    this.postText![i].textContent = "";
                    this.postImages![i].innerHTML = "";
                    this.editBtn![i].classList.add("hidden");
                    this.deleteBtn![i].classList.add("hidden");
                    this.postSection![i].classList.add("hidden");
                  });
                }
              });
              this.editBtn![i].addEventListener("click", () => {
                this.postText![i].contentEditable = "true";
                this.postText![i].focus();

                let newText = this.postText![i].textContent;
                this.postText![i].addEventListener("input", () => {
                  newText = this.postText![i].textContent;
                });

                this.postText![i].addEventListener("blur", () => {
                  this.postText![i].removeAttribute("contenteditable");
                  if (newText !== this.userText[i]) {
                    this.userText[i] = newText as string;
                    const postRef = refDb(db, `posts/${this.dbKeyValues[i]}`);
                    update(postRef, {
                      userText: newText,
                    });
                  }
                });
              });
            }
          }
        });
      }
    });
  }
}

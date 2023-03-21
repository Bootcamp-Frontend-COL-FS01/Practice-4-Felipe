import postHtml from "./post.html";
import "./post.scss";

export class Post {
  render(viewport: HTMLDivElement | null) {
    if (viewport) {
      viewport.innerHTML += postHtml;
    }
  }
}

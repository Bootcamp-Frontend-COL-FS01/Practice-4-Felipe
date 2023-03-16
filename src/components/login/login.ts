import LoginHtml from './login.html';
import './login.scss';

export class Login {
  render(viewport: HTMLDivElement | null) {
    if (viewport) {
      viewport.innerHTML = LoginHtml
    }
  }
}
import { css, html, LitElement } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { customElement, property, query } from "lit/decorators.js";
import { resolveUrl } from "../../../directives/resolve-url.directive";

@customElement("sn-img")
export class SNImg extends LitElement {
  static styles = [
    css`
    img {
      width: 100%;
    }
    .img-background {
      position: relative;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .img-background::before {
      content: '';
      inset: 0;
      position: absolute;
      will-change: opacity;
      transition: opacity 200ms ease-in-out;
      animation: pulse 2.5s infinite alternate;
      backdrop-filter: blur(5px);
    }

    .img-background.loaded::before {
      animation: none;
      content: none;
    }

    .img-background > img {
      opacity: 0;
      will-change: opacity;

      transition: opacity 500ms ease-in-out;
    }

    .img-background.loaded > img {
      opacity: 1;
    }

    :host {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        line-height: 0;
        position: relative;
      }

      @keyframes pulse {
        0% {
          background-color: rgba(255, 255, 255, 0.2);
        }

        50% {
          background-color: rgba(255, 255, 255, 0.4);
        }

        100% {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    `
  ]
  @property({ reflect: true })
  src?: string;

  @property({ reflect: true })
  placeholder?: string;

  @property({ reflect: true })
  alt?: string;

  @property({ type: Boolean })
  lazy: boolean = false;

  @query(".img-background")
  private _imgBackground?: HTMLDivElement;

  protected firstUpdated(): void {
    if (!this._imgBackground) return;
    const img = this._imgBackground.querySelector('img') as HTMLImageElement;

    if (img.complete) {
      this._imageLoaded();
    }else {
      img.addEventListener('load', () => {
        this._imageLoaded();
      })
    }
  }

  private _imageLoaded(): void {
    this._imgBackground?.classList.add('loaded');
  }

  protected render() {
    return html`
      <div
        class="img-background"
        style=${`background-color: gray; background-image: url(${this.placeholder}); `}
      >
        <img
          part="img"
          width="200"
          style="object-position: center; object-fit: cover; "
          loading=${this.lazy ? "lazy" : "eager"}
          src=${ifDefined(resolveUrl(this.src))}
          alt=${ifDefined(this.alt)}
        />
      </div>
    `;
  }
}

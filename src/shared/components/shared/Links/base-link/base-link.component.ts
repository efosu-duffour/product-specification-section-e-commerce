import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { resetStyles } from "../../../../styles/reset.styles";

@customElement("sn-link")
export class SNLink extends LitElement {
  static styles = [
    resetStyles,

    css`
      :host {
        position: static;
      }

      a {
        white-space: nowrap;
        color: #525252;
        border-radius: 100px;
        outline-offset: 0px;
        outline-color: transparent;
        outline-width: 2px;
        outline-style: solid;
        text-decoration: none;
        will-change: outline-color, color, outline-offset;
        font-size: clamp(0.9rem, 4vw, 1rem);

        @media (prefers-reduced-motion: no-preference) {
          transition: all 200ms ease-in-out;
        }
      }

      a:active {
        background: #3d3d3d;
      }

      a:focus-visible {
        outline-color: black;
        outline-offset: 5px;
        color: black;
      }

      a:hover {
        color: black;
      }
    `,
  ];
  @property()
  href: string = "";

  protected render(): unknown {
    return html`<a part="a" href=${this.href}>
      <slot>${this.href}</slot>
    </a>`;
  }
}

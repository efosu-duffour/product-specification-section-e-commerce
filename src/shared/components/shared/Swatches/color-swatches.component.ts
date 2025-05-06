import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { resetStyles } from "../../../styles/reset.styles";

@customElement("sn-color-swatch")
export class SNColorSwatch extends LitElement {
  @property({ type: String, reflect: true })
  color: string = "black";

  static styles = [
    resetStyles,
    css`
      div {
        width: 20px;
        aspect-ratio: 1 / 1;
        border-radius: 1000px;
        cursor: pointer;
        border: none;
        outline-offset: 3px;
        outline-color: transparent;
        outline-style: solid;
        will-change: outline;

        @media (prefers-reduced-motion: no-preference) {
            transition: outline-color 200ms ease-in-out;
        }
      }

      div:hover {
        outline-color: #7a7a7a;
      }

      :host([checked]) div {
        outline-color: black;
      }
    `,
  ];

  private _customEvent: CustomEvent = new CustomEvent("checked", {
    bubbles: true,
    composed: true,
  });

  protected firstUpdated(): void {
    setTimeout(() => {
      if (this.hasAttribute("checked")) {
        this.dispatchEvent(this._customEvent);
      }
    }, 0);

    this.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      this.dispatchEvent(this._customEvent);
    });

    this.addEventListener("keydown", (e) => {
      e.stopImmediatePropagation();
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        this.dispatchEvent(this._customEvent);
      }
    });
  }

  protected render() {
    return html`
      <div
        tabindex="0"
        style="background-color: ${this.color}"
        aria-label=${this.color}
      ></div>
    `;
  }
}

import { customElement, query } from "lit/decorators.js";
import { SNIcon } from "../shared/Icons/base-icon.component";
import { css, html } from "lit";
import { SNBaseButton } from "../shared/Buttons/base-button/base-button.component";
import { createCustomMouseEvent } from "../shared/utils/mouseevent";

@customElement("sn-menu-icon")
export class SNMenuIcon extends SNIcon {
  static styles = [
    ...super.styles,
    css`
    
      span {
        --span-height: 4px;
        display: block;
        height: var(--span-height);
        width: 100%;
        background: #020202;
        border-radius: 9px;
        opacity: 1;
        transform: rotate(0deg);
        transition: 0.25s ease-in-out;

        @media (prefers-reduced-motion: no-preferences) {
        }
      }

      :host([size="small"]) #nav-icon {
        --width: 20px;
      }

      :host([size="medium"]) #nav-icon {
        --width: 30px;
      }

      :host([size="large"]) #nav-icon {
        --width: 40px;
      }
      :host([size="small"]) span {
        --span-height: 4px;
      }

      :host([size="medium"]) span {
        --span-height: 6px;
      }

      :host([size="large"]) span {
        --span-height: 8px;
      }

      #nav-icon {
        overflow: hidden;
        --width: 20px;
        --height: var(--width);
        width: var(--width);
        height: var(--height);
      }

      span:nth-child(2) {
        margin-top: calc((var(--height) - 3 * var(--span-height)) / 2);
      }

      span:nth-child(3) {
        margin-top: calc(-1 * var(--span-height));
      }

      span:nth-child(4) {
        margin-top: calc((var(--height) - 3 * var(--span-height)) / 2);
      }

      :host(.open) span:nth-child(1) {
        opacity: 0;
      }

      :host(.open) span:nth-child(2) {
        -webkit-transform: rotate(45deg);
        -moz-transform: rotate(45deg);
        -o-transform: rotate(45deg);
        transform: rotate(45deg);
      }

      :host(.open) span:nth-child(3) {
        -webkit-transform: rotate(-45deg);
        -moz-transform: rotate(-45deg);
        -o-transform: rotate(-45deg);
        transform: rotate(-45deg);
      }

      :host(.open) span:nth-child(4) {
        margin-top: calc(-1 * (var(--height) - 3 * var(--span-height)) / 2);
        opacity: 0;
      }
    `,
  ];

  protected render() {
    return html`
      <div id="nav-icon">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sn-menu-icon": SNMenuIcon;
  }
}

@customElement("sn-menu-button")
export class SNMenuButton extends SNBaseButton {
  private _isOpened = false;

  @query("sn-menu-icon")
  private _snMenuIcon?: SNMenuIcon;

  private _toogleClass(): void {
    if (this._isOpened) {
      this.classList.add("open");
      if (this._snMenuIcon) this._snMenuIcon.classList.add("open");
    } else {
      this.classList.remove("open");
      if (this._snMenuIcon) this._snMenuIcon.classList.remove("open");
    }
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._toogleClass();
  }

  protected _onClick(e: MouseEvent): void {

    this._isOpened = !this._isOpened;
    this._toogleClass();
    const toogleEvent = createCustomMouseEvent("sn-toggle", e, {
      bubbles: true,
      composed: true,
      details: { isOpened: this._isOpened },
    });

    this.dispatchEvent(toogleEvent);
  }
  protected render() {
    return html`
      <div 
      aria-label=${this._isOpened ? "close menu" : "open menu"}
      aria-expanded=${this._isOpened ? "true" : "false"}
      role="button"
      aria-haspopup="true"
      aria-controls="mobile-nav">
        <sn-menu-icon size="small"></sn-menu-icon>
      </div>
    `;
  }
}

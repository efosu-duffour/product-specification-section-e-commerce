import { css, html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import { resetStyles } from "../../../styles/reset.styles";

@customElement("sn-form-popover")
export class SNFormPopover extends LitElement {
  static styles = [
    resetStyles,
    css`
      :host {
        --color: black;
        --background-color: gray;
        font-family: inherit;
      }

      ::slotted([slot="type"]) {
        color: var(--color);
        font-weight: 600;
        border-radius: 1000px;
        padding: 5px;
        box-shadow: 0px 2px 5px #0000001a;
        background-color: white;
      }

      ::slotted([slot="message"]) {
        color: var(--color);
      }

      [popover="manual"] {
        position: absolute;
        margin: 0;

        top: -35px;
        justify-self: center;
        font-size: clamp(0.8rem, 3vw, 0.9rem);
        border-radius: 1000px;
        font-weight: 400;
        border: none;

        padding: 0.3em 0.5em;

        background-color: var(--background-color);

        grid-template-columns: auto 1fr;
        align-items: center;
        justify-content: center;
        gap: 15px;

        @media (prefers-reduced-motion: no-preference) {
          transition-property: top, display;
          transition-duration: 400ms;
          transition-behavior: allow-discrete;
        }
      }

      [popover="manual"]:popover-open {
        top: 20px;
        display: grid;
      }

      @starting-style {
        [popover="manual"]:popover-open {
          top: -35px;
        }
      }
    `,
  ];
  @query("[popover]")
  private _popover!: HTMLDivElement;

  private _isVisible: boolean = false;

  private _timerID?: number;

  show(): void {
    if (this._isVisible) return;
    this._isVisible = true;
    this._popover.showPopover({ source: document.body });
    if (this._timerID) {
      window.clearTimeout(this._timerID);
    }

    this._timerID = window.setTimeout(() => {
      this.hide();
    }, 5000);
  }

  hide(): void {
    if (!this._isVisible) return;
    this._isVisible = false;
    this._popover.hidePopover();
  }

  protected render() {
    return html`
      <div popover="manual" class="popover-content">
        <slot name="type"></slot>
        <slot name="message"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sn-form-popover": SNFormPopover;
  }
}

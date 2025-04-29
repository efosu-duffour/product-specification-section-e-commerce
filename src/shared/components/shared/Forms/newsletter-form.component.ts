import { css, html, LitElement } from "lit";
import { customElement, query, queryAll, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import "./form-popovers.component";
import { postEmail } from "../../../../services/email-server.service";
import { SNFormPopover } from "./form-popovers.component";
import { resetStyles } from "../../../styles/reset.styles";

@customElement("sn-newsletter-form")
export class SNNewsletterForm extends LitElement {
  static styles = [
    resetStyles,

    css`
      .sr-only {
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        top: auto;
        overflow: hidden;
      }

      form {
        display: flex;
        flex-wrap: wrap;

        row-gap: 30px;
        column-gap: 10px;
      }

      input[type="email"] {
        padding: 5px;
        border-radius: 5px;
        border-style: solid;
        border-color: rgb(194, 194, 194);
        border-width: 1px;
        font-family: inherit;
      }

      button[type="submit"] {
        padding: 7px;
        border-style: none;
        border-radius: 4px;

        font-weight: 600;
        cursor: pointer;
        flex-grow: 1;
        

        color: white;
        background-color: rgba(3, 3, 173, 0.863);
        will-change: background-color color;

        @media (prefers-reduced-motion: no-preference) {
          transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
        }
      }

      button[type="submit"]:hover {
        background-color: rgba(0, 0, 255, 0.623);
      }

      button[type="submit"]:disabled {
        background-color: rgba(128, 128, 128, 0.562);
        color: white;
        cursor: not-allowed;
      }

      button[type="submit"].pending {
        animation-name: background-pulse;
        animation-iteration-count: infinite;
        animation-duration: 500ms;
        animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation-direction: alternate;
      }

      @keyframes background-pulse {
        from {
          background-color: rgba(0, 0, 255, 0.623);
        }

        to {
          background-color: rgba(91, 91, 252, 0.685);
        }
      }

      input[type="email"]::placeholder {
        color: rgba(0, 0, 0, 0.377);
      }

      .input-container {
        position: relative;
        flex-grow: 1;
        display: grid;
        grid-template-columns: minmax(35ch, 1fr);
      }

      button:focus-visible,
      input:focus-visible {
        outline-color: rgba(72, 72, 255, 0.438);
        outline-offset: 4px;
      }

      .error {
        position: absolute;
        bottom: -20px;
        left: 0;
        right: 0;
        height: 15px;
        width: 100%;
        opacity: 1;
        margin-left: 5px;

        font-size: 0.7rem;
        color: red;
        will-change: opacity;

        @media (prefers-reduced-motion: no-preference) {
          transition: opacity 200ms ease-in-out;
        }
      }

      .error.hide {
        opacity: 0;
      }

      [errorPopover] {
        --color: #e55b5b;
        --background-color: #fef2f2;
      }

      [successPopover] {
        --color: #32834e;
        --background-color: #f0fdf4;
      }
    `,
  ];
  @state()
  private _isValid: boolean = false;

  @state()
  private _isPending: boolean = false;

  @state()
  private _successSubmit: boolean = false;

  @query("form")
  private _form!: HTMLFormElement;

  @query("#error")
  private _errorSpan!: HTMLSpanElement;

  @queryAll("sn-form-popover")
  private _popovers!: NodeListOf<SNFormPopover>;

  private async _handleSubmit(event: MouseEvent): Promise<void> {
    event.preventDefault();
    this._isValid = this._form.checkValidity();
    if (!this._isValid) return;

    this._isPending = true;
    const email = this._form.email.value;
    try {
      await postEmail(email);
      this._closeAllPopovers();
      this._popovers[0].show(); // Show success popover
      this._successSubmit = true;
      this._form.reset();
      this._errorSpan.textContent = "";
    } catch (error) {
      this._closeAllPopovers();
      this._popovers[1].show(); // Show error popover
      this._successSubmit = false;
    }

    this._isPending = false;
  }

  private _closeAllPopovers(): void {
    this._popovers.forEach((popover) => {
      popover.hide();
    });
  }

  private _formInfo(): string {
    if (this._isPending) return "Submitting...";
    if (this._successSubmit)
      return "Subscription successful! Please check your email to confirm";
    return "Failed to subscribe. Please ensure your email is correct or try again letter";
  }

  private _handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.validity.valueMissing) {
      this._isValid = false;
      this._errorSpan.textContent = "Please enter an email address";
      return;
    }

    if (input.validity.typeMismatch) {
      this._isValid = false;
      this._errorSpan.textContent = "Please enter a valid email address";
      return;
    }

    if (input.validity.valid) {
      this._isValid = true;
      this._errorSpan.textContent = "";
      return;
    }
  }

  protected render() {
    return html`
      <form>
        <label for="email" class="sr-only">Email Adresss:</label>
        <div class="input-container">
          <input
            @input=${this._handleInput}
            aria-invalid=${this._isValid ? "true" : "false"}
            id="email"
            type="email"
            placeholder="username@example.com"
            name="email"
            required
          />
          <span
            id="error"
            role="status"
            aria-live="polite"
            class=${classMap({error: true, hide: this._isValid})}
          ></span>
        </div>
        <button
          @click=${this._handleSubmit}
          ?disabled=${!this._isValid}
          class=${classMap({ pending: this._isPending })}
          type="submit"
        >
          Subscribe
        </button>
      </form>
      <span aria-live="assertive" class="sr-only" id="form-info"
        >${this._formInfo()}</span
      >
      <sn-form-popover successPopover>
        <div slot="type">Success</div>
        <div slot="message">
          Subscription successful! Please check your email to confirm
        </div>
      </sn-form-popover>
      <sn-form-popover errorPopover>
        <div slot="type">Error</div>
        <div slot="message">
          Failed to subscribe. Please ensure your email is correct or try again
          letter
        </div>
      </sn-form-popover>
    `;
  }
}

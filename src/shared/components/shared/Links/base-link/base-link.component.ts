import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { resetStyles } from "../../../../styles/reset.styles";
import { LINK_TOKENS } from "./base-link.styles";

@customElement('sn-link')
export class SNLink extends LitElement {
    static styles = [
        resetStyles,
        LINK_TOKENS,
        css`
        a {
            white-space: nowrap;
        }
        `,
    ]
    @property({type: String, useDefault: true, reflect: true})
    href: string = "";

    protected render(): unknown {
        return html`<a href=${this.href}>
        <slot>${this.href}</slot>
    </a>`
    }
}
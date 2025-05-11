import { css, html, LitElement } from "lit";
import { customElement} from "lit/decorators.js";
import { resetStyles } from "../../../styles/reset.styles";

@customElement('sn-gallery-slider')
export class SNGallerySlider extends LitElement {

    static styles = [
        resetStyles,
        css`
        
        :host {
            display: grid;
            width: 200px;
            aspect-ratio: 1;

            border-radius: 10px;
            overflow: hidden;
        }

        ::slotted(sn-img) {
            grid-row: 1 / -1;
            grid-column: 1 / -1;
            opacity: 0;
            will-change: opacity;

            @media (prefers-reduced-motion: no-preference) {
                transition: opacity 800ms cubic-bezier(.23,.96,.65,1);
            }
        }

        ::slotted(.active) {
            opacity: 1;
        }
        `
    ]

    protected render() {
        return html`
            <slot></slot>
        `
    }
}
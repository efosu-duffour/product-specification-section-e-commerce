import { css, html, LitElement, PropertyValues } from "lit";
import { customElement, property, queryAssignedElements} from "lit/decorators.js";
import { resetStyles } from "../../../styles/reset.styles";

@customElement('sn-gallery-slider')
export class SNGallerySlider extends LitElement {

    static styles = [
        resetStyles,
        css`
        
        .gallery-container {
            display: grid;
            width: 200px;
            height: 200px;
            isolation: isolate;

            border-radius: 10px;
            overflow: hidden;
        }

        ::slotted(*) {
            grid-row: 1 / -1;
            grid-column: 1 / -1;
            opacity: 0;
            will-change: opacity;
            mix-blend-mode: lighter;

            @media (prefers-reduced-motion: no-preference) {
                transition: opacity 800ms cubic-bezier(.23,.96,.65,1);
            }
        }

        ::slotted(.active) {
            opacity: 1;
        }
        `
    ]
    @queryAssignedElements({flatten: true})
    private _imgSlots?: Array<HTMLElement>;

    @property({type: Number, reflect: true}) 
    index: number = 0;

    protected updated(_changedProperties: PropertyValues): void {
        if (this._imgSlots) {
            if ( _changedProperties.has('index')) {
                if (this.index > this._imgSlots.length - 1)
                    throw new RangeError("The index is out of range");
            }

            for (let i = 0; i < this._imgSlots?.length; i++) {
                if ( i !== this.index) {
                    this._imgSlots[i].classList.remove('active');
                    continue;
                }

                this._imgSlots[i].classList.add('active');
            }
        }

    }

    protected render() {
        return html`
        <div class="gallery-container">
            <slot></slot>
        </div>
        `
    }
}
import { html, LitElement } from "lit";
import { customElement, queryAssignedElements } from "lit/decorators.js";
import { SNColorSwatch } from "./color-swatches.component";
import { resetStyles } from "../../../styles/reset.styles";

@customElement('sn-color-swatch-group')
export class SNColorSwatchGroup extends LitElement {
    static styles = [
        resetStyles,
    ]
    @queryAssignedElements()
    private _snColorSwatches?: Array<SNColorSwatch>;

    protected firstUpdated(): void {
        if (!this._snColorSwatches) return;

        for (let i = 0; i < this._snColorSwatches.length; i++) {
            this._snColorSwatches[i].addEventListener('checked', (e) => {
                this._handleColorSwatchClick(e, i);
            })
        }
    }

    private _handleSlots(): void {
        if (!this._snColorSwatches) return;

        for (let i = 0; i < this._snColorSwatches.length; i++) {
            if (this._snColorSwatches[i] instanceof SNColorSwatch) continue;
            else throw new TypeError('Slotted elements should be an instance of SNColorSwatch')
        }
    }

    private _handleColorSwatchClick(e: Event, idx: number): void {
        e.stopImmediatePropagation();
        const color = (e.target as SNColorSwatch).getAttribute('color');
        this._toggleCheckState(e.target as SNColorSwatch);
        this.dispatchEvent(new CustomEvent('colorChanged', {composed: true, bubbles: true, detail: {color: color, index: idx}}));
    }

    private _toggleCheckState(elem: SNColorSwatch): void {
        if (!this._snColorSwatches) return;

        this._snColorSwatches.forEach(snColorSwatch => {
            if (snColorSwatch !== elem)
                snColorSwatch.removeAttribute('checked');
            else {
                snColorSwatch.setAttribute('checked', '');
            }
        })
    }

    protected render() {
        return html`
        <slot @slotchange=${this._handleSlots}></slot>
        `
    }
}
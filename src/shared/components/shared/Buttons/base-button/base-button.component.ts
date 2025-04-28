import {customElement} from 'lit/decorators.js'
import {css, html, LitElement} from 'lit';
import { createCustomMouseEvent } from '../../utils/mouseevent';
import { resetStyles } from '../../../../styles/reset.styles';
import { BUTTON_TOKENS } from '../button.styles';

@customElement('sn-button')
export class SNBaseButton extends LitElement {
    static styles = [
        resetStyles,
        BUTTON_TOKENS,
        css`
        :host {
            cursor: pointer;
            outline: none;
        }

       :host([disabled]) {
           pointer-events: none;
        }
        `
    ]

    constructor() {
        super();
        this._initAttributes();
    }

    protected _initAttributes() {
        this.tabIndex = 0;
        this.role = 'button';
    }

    protected firstUpdated(): void {
        this.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            this._onClick(e);
        });

        this.addEventListener('keydown', (e) => {
            e.stopImmediatePropagation();
            this._onKeyDown(e);
        })
    }
    protected _onClick (e: MouseEvent): void {
        const customEvent = createCustomMouseEvent('sn-click', e, {composed: true, bubbles: true});
        this.dispatchEvent(customEvent);
    }

    protected _onKeyDown(e: KeyboardEvent) {
        if (e.key === ' ') {
            this._onClick(e as any)
        }
    }

    protected render() {
        return html`
        <div>
            <slot></slot>     
        </div>
        `
    }
}
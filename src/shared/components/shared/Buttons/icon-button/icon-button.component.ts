import { css, html, nothing} from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { SNBaseButton } from "../base-button/base-button.component";
import { skipEmptyStringConverter } from "../../../../utils/skipEmptyString";

@customElement('sn-icon-button')
export class SNIconButton extends SNBaseButton{
    static styles = [
        ...super.styles,

        css`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        [anchor] {
            anchor-name: --sn-button;
        }

        [popover] {
            position: absolute;
            background-color: red;
            position-anchor: --sn-button;
            top: calc(anchor(bottom) + 5px);
            justify-self: anchor-center;

            border: none;
            border-radius: 0.3em;
            font-size: 14px;
            font-weight: 500;
            color: white;

            padding: 5px;
            background-color: #585858;

            opacity: 0;
            @media (prefers-reduced-motion: no-preference) {
                transition: opacity 200ms ease-in-out;
                transiton-behavior: allow-discrete;
            }
        }
        
        [popover]:popover-open { 
            opacity: 1; 

            @starting-style {
                opacity: 0;
            }
        }
        `
    ];

    @query('#tooltip')
    private _tooltipElem?: HTMLElement;

    private _popoverTimerID?: number;

    @property({type: String, reflect: true, converter: skipEmptyStringConverter})
    href: string = '';

    @property({type: String, reflect: true, converter: skipEmptyStringConverter})
    tooltip: string = '';

    protected override _onClick (e: MouseEvent): void {
        super._onClick(e);
        console.log(this.href)
        if (this.href)
            window.location.href = this.href;
    }

    protected firstUpdated(): void {
        super.firstUpdated();
        
        this.addEventListener('mouseenter', () => {
            this._popoverTimerID = setTimeout(() => {
                this._tooltipElem?.showPopover();
            }, 300)
        });
        this.addEventListener('mouseleave', () => {
            clearTimeout(this._popoverTimerID);
            this._tooltipElem?.hidePopover();
        });
        this.addEventListener('focus', () => {
            this._popoverTimerID = setTimeout(() => {
                this._tooltipElem?.showPopover();
            }, 300)
        });
        this.addEventListener('blur', () => {
            clearTimeout(this._popoverTimerID);
            this._tooltipElem?.hidePopover();
        })
    }

    private _renderTooltip() {
        return this.tooltip ? 
                html`
                <div id="tooltip" popover="hint">
                    ${this.tooltip}
                </div>
            ` : nothing;
    }
    
    protected render() {
        return html`
        <div aria-label=${this.tooltip} role="button" anchor>
            <slot name="icon"></slot>
        </div>
        ${this._renderTooltip()}
        `;
    }
}
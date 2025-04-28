import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { resetStyles } from "../../../styles/reset.styles";

type ImgSizes = {
    [a: string]: number;
    small: number;
    medium: number;
    large: number;
}

@customElement('sn-icon')
export class SNIcon extends LitElement {
    static styles = [
        resetStyles,

        css`
     
        :host([size='small']) > div,  :host([size]) > div  {
            padding: 4px;
        }

        :host([size='medium']) > div {
            padding: 6px;
            background-color: red;

        }

        :host([size='large']) > div {
            padding: 8px;
            background-color: red;
        }
        `
    ]
    @property({type: String, reflect: true, useDefault: true})
    src?: string = '';
    
    @property({type: String, reflect: true, useDefault: true})
    srcset?: string = '';

    @property({type: String, reflect: true, useDefault: true})
    alt?: string = '';

    @property({type: String, reflect: true, useDefault: true})
    size: 'small' | 'medium' | 'large'  = 'small';

    

    protected static _imgSizes: ImgSizes = {
        small: 24,
        medium: 34,
        large: 40,
    }
    protected get _resolveImgUrl(): string {
        if (this.src)
         return import.meta.env.BASE_URL + this.src;
        return '';
    }

    protected get _resolveImgSrcset(): string {
        if (this.srcset)
            this.srcset.replace(/(\/[a-zA-Z0-9\-_\/]+)/g, `${import.meta.env.BASE_URL}$1`)
        return '';
    }
    protected render() {
        return html`
        <img 
            width=${SNIcon._imgSizes[this.size]} 
            height=${SNIcon._imgSizes[this.size]} 
            src=${this._resolveImgUrl ?? ''} 
            srcset=${this._resolveImgSrcset ?? ''} 
            alt=${this.alt ?? ''}
            style='object-fit: contain; object-position: center;}'/>
        `
    }

}
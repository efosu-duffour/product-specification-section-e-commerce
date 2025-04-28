import { css } from "lit";

export const BUTTON_TOKENS = css`
  :host {
    --sn-btn-outline-primary: transparent;
    --sn-btn-focus-outline: unset;
    --sn-btn-focus-outline-width: 2px;
    --sn-btn-focus-outline-primary: black;
    --sn-btn-focus-outline-style: solid;
    --sn-btn-background-primary: unset;
    --sn-btn-disabled-outline-primary: unset;
    --sn-btn-disabled-outline-secondary: unset;
    --sn-btn-disabled-background-primary: unset;
    --sn-btn-active-background-primary: unset;
    --sn-btn-border: unset;
    --sn-btn-border-radius: 10%;
    --sn-btn-border-primary: unset;
    --sn-btn-border-width: unset;
    --sn-btn-border-style: unset;
    --sn-btn-outline: unset;
    --sn-btn-active-background-primary: #c0c0c0;
    --sn-btn-hover-background-primary: #e4e4e4;
  }

  :host {
    outline: var(--sn-btn-outline);
    outline-color: var(--sn-btn-outline-primary);
    border: var(--sn-btn-border);
    border-radius: var(--sn-btn-border-radius);
    border-color: var(--sn-btn-border-primary);
  }

  :host(:hover) {
    background-color: var(--sn-btn-hover-background-primary);
  }

  :host([disabled]) {
    background-color: var(--sn-btn-disabled-background-primary);
  }

  :host(:active) {
    background-color: var(--sn-btn-active-background-primary);
  }

  :host(:focus-visible) {
    outline: var(--sn-btn-focus-outline);
    outline-color: var(--sn-btn-focus-outline-primary);
    outline-width: var(--sn-btn-focus-outline-width);
    outline-style: var(--sn-btn-focus-outline-style);
    border-radius: var(--sn-btn-border-radius);
  }
`;

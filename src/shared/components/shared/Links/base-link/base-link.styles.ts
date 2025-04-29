import { css } from "lit";

export const LINK_TOKENS = css`
  :host {
    --sn-lkn-outline: unset;
    --sn-lkn-outline-width: 2px;
    --sn-lkn-outline-clr: transparent;
    --sn-lkn-outline-style: solid;
    --sn-lkn-focus-outline-width: unset;
    --sn-lkn-focus-outline-clr: black;
    --sn-lkn-focus-outline-style: unset;
    --sn-lkn-border: unset;
    --sn-lkn-background: unset;
    --sn-lkn-font-size: clamp(0.8rem, 5vw, 0.9rem);
    --sn-lkn-font-weight: 500;
    --sn-lkn-font-family: inherit;
    --sn-lkn-primary: #555555;
    --sn-lkn-focus-outline: unset;
    --sn-lkn-focus-border: unset;
    --sn-lkn-focus-background: unset;
    --sn-lkn-hover-outline: initial;
    --sn-lkn-hover-border: unset;
    --sn-lkn-hover-background: unset;
    --sn-lkn-hover-clr: black;
    --sn-lkn-active-outline: unset;
    --sn-lkn-active-border: unset;
    --sn-lkn-active-background: unset;
    --sn-lkn-padding: 0em;
    --sn-lkn-border-radius: 1000px;
    --sn-lkn-text-transform: none;
    --sn-lkn-decoration: none;
    --sn-lkn-transition: 200ms ease-in-out;
    -sn-lkn-focus-clr: black;

    font-family: var(--sn-lkn-font-family);
    font-size: var(--sn-lkn-font-size);
    font-weight: var(--sn-lkn-font-weight);
  }

  a:active {
    background: var(--sn-lkn-active-background);
  }

  a:focus-visible {
    outline-color: var(--sn-lkn-focus-outline-clr);
    outline-offset: 5px;
    color: var(--sn-lkn-focus-clr);
    border: var(--sn-lkn-focus-border);
    background: var(--sn-lkn-focus-background);
  }

  a:hover {
    background: var(--sn-lkn-hover-background);
    color: var(--sn-lkn-hover-clr);
  }

  a {
    color: var(--sn-lkn-primary);
    outline: var(--sn-lkn-outline);
    padding: var(--sn-lkn-padding);
    border: var(--sn-lkn-border);
    background: var(--sn-lkn-background);
    border-radius: var(--sn-lkn-border-radius);
    text-transform: var(--sn-lkn-text-transform);
    text-decoration: var(--sn-lkn-decoration);
    outline-color: var(--sn-lkn-outline-clr);
    outline-width: var(--sn-lkn-outline-width);
    outline-style: var(--sn-lkn-outline-style);

    @media (prefers-reduced-motion: no-preference) {
      transition: var(--sn-lkn-transition);
    }
  }
`;

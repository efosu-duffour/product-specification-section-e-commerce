
/**
 * @vitest-environment jsdom
 */

import { html, render } from "lit";
import { describe, beforeEach, it, expect } from "vitest";
import { resolveUrl } from "../src/shared/directives/resolve-url.directive";

describe("resolveUrlDirective", () => {
  beforeEach(() => {
    render(
      html`
        <a empty-url href="${resolveUrl("")}">Test Link</a>
        <a vite-url href="${resolveUrl("/example.com")}">Test Link</a>
        <img
          absolute-url
          src="${resolveUrl("https://example.com/image.png")}"
        />
      `,
      document.body
    );
  });

  it("sets the correct empty href on <a>", () => {
    const emptyUrl = document.querySelector("[empty-url]");
    expect(emptyUrl).toBeTruthy();
    expect(emptyUrl?.getAttribute('href')).toBe('');
  });

  it("sets the correct vite src on <img>", () => {
    const viteUrl = document.querySelector('[vite-url]')
    expect(viteUrl).toBeTruthy();
    expect(viteUrl?.getAttribute('href')).toBe(import.meta.env.BASE_URL + '/example.com'); 
  });


  it("sets the correct absolute src on <img>", () => {
    const absoluteUrl = document.querySelector("[absolute-url]");
    expect(absoluteUrl).toBeTruthy();
    expect(absoluteUrl?.getAttribute('src')).toBe('https://example.com/image.png');
  });
});

describe("resolveUrlDirective Misimplementation Errors", () => {
  it("throws error if used in text content", () => {
    expect(() => {
      render(html`<div>${resolveUrl("https://bad.com")}</div>`, document.body);
    }).to.throw();
  });

  it("throws error if used in wrong attribute content", () => {
    expect(() => {
      render(
        html`<div width=${resolveUrl("https://bad.com")}></div>`,
        document.body
      );
    }).to.throw();
  });
});

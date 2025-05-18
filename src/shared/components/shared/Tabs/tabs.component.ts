import { css, html, LitElement } from "lit";
import { customElement, queryAll } from "lit/decorators.js";
import { resolveUrl } from "../../../directives/resolve-url.directive";
import {
  isAtScrollLeft,
  isAtScrollRight,
  isOverFlowingX,
} from "../../../styles/utils";

@customElement("sn-tab")
export class SNTab extends LitElement {
  private _currentIndex = 0;

  static styles = [
    css`
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      :host {
        color: #515151;

        display: grid;
        row-gap: 30px;
      }

      li {
        list-style: none;
      }

      .spec-feature {
        display: flex;
        align-items: center;
        column-gap: 20px;

        & > span {
          white-space: nowrap;
        }
      }

      .spec-image-container {
        padding: 10px;
        background-color: white;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.116);
        border-radius: 1000px;
        display: flex;
        align-items: center;

        & > img {
          width: 20px;
          height: 20px;
          user-select: none;
        }
      }

      .spec {
        display: flex;

        column-gap: 30px;
        grid-row: 1 / -1;
        grid-column: 1 / -1;

        @media (prefers-reduced-motion: no-preference) {
          transition: opacity 200ms 200ms ease-in-out, 200ms 200ms display;
          transition-behavior: allow-discrete;
        }
      }

      .spec[hidden] {
        display: none;
        opacity: 0;
      }

      @starting-style {
        .spec {
          opacity: 0;
        }
      }

      .spec-features-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
        max-width: 650px;

        margin-top: auto;
      }

      .spec-info {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .tab-panels-container {
        display: grid;
        container-type: inline-size;
        container-name: tab-panel-container;
      }

      .tabs-container {
        display: flex;
        column-gap: 30px;
        position: relative;
        padding-block: 20px;
        grid-row: 1 / 2;
        grid-column: 1 / -1;

        &::-webkit-scrollbar {
          appearance: none;
        }

        &::before {
          content: "";
          right: 0;
          left: 0;
          bottom: 0;

          height: 1.5px;

          position: absolute;
          background-color: #e9e9e9;
        }

        @media (max-width: 400px) {
          overflow-x: scroll;
          scroll-behavior: smooth;
          scroll-snap-align: center;
          scroll-snap-type: x proximity;
        }
      }

      .tabs-container-mask {
        height: 100%;
        width: 100%;
        grid-column: 1 / -1;
        grid-row: 1 / 2;
        z-index: 1;
        pointer-events: none;
        transform-origin: center;
        transform: scaleX(1.1);

        --left-background-image: linear-gradient(90deg, transparent calc(100% - 90px),  white);
        --right-background-image: linear-gradient(90deg, #ffffff, transparent 90px);

        &.hide {
          opacity: 0;
        }

        &.show {
          opacity: 1;
        }

        &.left {
          
         background-image: var(--left-background-image);
        }

        &.right {
          
           background-image: var(--right-background-image);
        }

        &.both {
          background-image: var(--left-background-image), var(--right-background-image);
        }
      }

      sn-img {
        --flex-basis: 350px;
        aspect-ratio: 1.2 / 0.8;
        flex-basis: var(--flex-basis);
        flex-shrink: 0;
        flex-grow: 0;

        overflow: clip;
        border-radius: 10px;
      }

      .tab {
        font-size: 0.9rem;
        font-family: inherit;
        color: inherit;

        background-color: transparent;
        border: none;
        outline-color: transparent;
        outline-style: solid;
        outline-width: 2px;
        outline-offset: 0px;
        border-radius: 100px;
        cursor: pointer;

        position: relative;

        @media (prefers-reduced-motion: no-preference) {
          transition: color 200ms ease-in-out;
        }
        &::before {
          position: absolute;

          content: "";
          right: 0;
          left: 0;
          bottom: -20px;
          height: 1.5px;
          background-color: transparent;

          @media (prefers-reduced-motion: no-preference) {
            transition: background-color 200ms ease-in-out;
          }
        }

        &:focus-visible {
          outline-color: black;
          outline-offset: 4px;
        }

        &[selected] {
          color: #3f33c9;

          &::before {
            background-color: #3f33c9;
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          transition: all 200ms ease-in-out;
        }
      }

      h3 {
        color: black;
        font-size: clamp(1.3rem, 3vw, 1.4rem);
      }

      p {
        line-height: 1.5;
        font-size: clamp(0.9rem, 3vw, 1rem);
      }

      @container tab-panel-container (max-width: 860px) {
        .spec {
          flex-wrap: wrap;
          column-gap: 0;
          row-gap: 30px;
        }

        .spec-features-container {
          margin-top: 20px;
        }

        sn-img {
          --flex-basis: 100%;
        }
      }

      @container tab-panel-container (max-width: 500px) {
        .spec-features-container {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];

  @queryAll(".tab")
  private _tabs?: NodeListOf<HTMLElement>;

  @queryAll(".tab-panel")
  private _tabPanels?: NodeListOf<HTMLElement>;
  

  firstUpdated() {
    this._initializeSlottedElements();

    // Kills its placeholder animation
    const placeholder = document.querySelector(
      ".placeholder"
    ) as HTMLDivElement;
    placeholder.remove();

    // Adding listeners for the tabs mask
    const mask =  this.shadowRoot?.querySelector('.tabs-container-mask');
    const tabList = this.shadowRoot?.querySelector('[role="tablist"]');
    window.addEventListener('load', () => {
      this._updateScrollMask(tabList as HTMLElement, mask as HTMLElement);
    }, {once: true});

    tabList?.addEventListener('scroll', scrollEvent => {
      this._updateScrollMask(scrollEvent.target as HTMLElement, mask as HTMLElement);
    });

    window.addEventListener('resize', () => {
      this._updateScrollMask(tabList as HTMLElement, mask as HTMLElement);
    });

  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    const tabList = this.shadowRoot?.querySelector('[role="tablist"]');
    const mask =  this.shadowRoot?.querySelector('.tabs-container-mask');
    tabList?.removeEventListener('scroll', scrollEvent => {
      this._updateScrollMask(scrollEvent.target as HTMLElement, mask as HTMLElement);
    })

    window.removeEventListener('resize', () => {
      this._updateScrollMask(tabList as HTMLElement, mask as HTMLElement);
    });
  }

  private _initializeSlottedElements(): void {
    if (!this._tabs || !this._tabPanels) return;

    this._tabs?.forEach((tab, index) => {
      tab.setAttribute("role", "tab");
      tab.setAttribute("id", `tab-${index}`);
      tab.setAttribute("aria-controls", `tab-panel-${index}`);
      tab.setAttribute("aria-selected", String(this._currentIndex === index));
      tab.setAttribute("tabindex", this._currentIndex === index ? "0" : "-1");
      tab.addEventListener("keydown", this._handleKeyDown);
      tab.addEventListener("click", (clickEvent) => {
        this._handleClick(clickEvent, index);
      });
    });

    this._tabPanels.forEach((tabPanel, index) => {
      tabPanel.setAttribute("role", "tabpanel");
      tabPanel.setAttribute("id", `tab-panel-${index}`);
      tabPanel.setAttribute("aria-labelledby", `tab-${index}`);
    });
  }

  private _wrappedIndex(
    offset: number,
    currentIndex: number,
    max: number
  ): number {
    return (currentIndex + offset + max) % max;
  }

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (!this._tabPanels || !this._tabs) return;
    if (event.key === "ArrowRight")
      this._currentIndex = this._wrappedIndex(
        1,
        this._currentIndex,
        this._tabPanels.length
      );

    if (event.key === "ArrowLeft")
      this._currentIndex = this._wrappedIndex(
        -1,
        this._currentIndex,
        this._tabPanels.length
      );

    this._updateTabsAttributes(this._currentIndex);
    this._updateTabPanelsAttributes(this._currentIndex);
    this._tabs[this._currentIndex].focus();
  };

  private _handleClick = (_: MouseEvent, index: number) => {
    this._currentIndex = index;
    this._updateTabsAttributes(this._currentIndex);
    this._updateTabPanelsAttributes(this._currentIndex);
  };

  private _updateTabsAttributes(currentIndex: number): void {
    this._tabs!.forEach((tab, index) => {
      if (currentIndex === index) {
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("tabindex", "0");
        tab.setAttribute("selected", "");
      } else {
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
        tab.removeAttribute("selected");
      }
    });
  }

  private _updateTabPanelsAttributes(currentIndex: number): void {
    this._tabPanels!.forEach((tabPanel, index) => {
      tabPanel.hidden = currentIndex != index;
    });
  }

  private _updateScrollMask = (scrollable: HTMLElement, mask: HTMLElement): void => {
    
    if (!isOverFlowingX(scrollable)) {
      this._hideScrollMask(mask);
      return;
    } else {
      this._showScrollMask(mask);
    }

    if (isAtScrollLeft(scrollable)) {
      this._showLeftMask(mask);
      this._hideRightMask(mask);
    } else if (isAtScrollRight(scrollable)) {
      this._showRightMask(mask);
      this._hideLeftMask(mask);
    } else {
      this._showBothMaskes(mask);
    }
  }

  private _showScrollMask(mask: HTMLElement): void {
    mask.classList.remove("hide");
    mask.classList.remove('both');
    mask.classList.add("show");
  }

  private _hideScrollMask(mask: HTMLElement): void {
    mask.classList.remove("show");
    mask.classList.remove('both');
    mask.classList.add("hide");
  }

  private _showLeftMask(mask: HTMLElement): void {
    mask.classList.remove('both');
    mask.classList.add("left");
  }

  private _hideLeftMask(mask: HTMLElement): void {
    mask.classList.remove("left");
  }

  private _showRightMask(mask: HTMLElement): void {
    mask.classList.remove('both');
    mask.classList.add("right");
  }

  private _hideRightMask(mask: HTMLElement): void {
    mask.classList.remove("right");
  }

  private _showBothMaskes(mask: HTMLElement): void {
    this._hideRightMask(mask);
    this._hideLeftMask(mask);
    mask.classList.add('both');
  }

  protected render() {
    return html`
      <div class="tabs-container-mask"></div>
      <div part="tabs-container" class="tabs-container" role="tablist">
        <button class="tab" selected type="button">Sustainability</button>
        <button class="tab" type="button">Comfort</button>
        <button class="tab" type="button">Durability</button>
        <button class="tab" type="button">Versatility</button>
      </div>
      <div part="tab-panels-container" class="tab-panels-container">
        <section class="tab-panel spec">
          <sn-img class="spec-image">
            <picture>
              <source
                media="(max-width: 956px)"
                srcset=${resolveUrl("/images/yellow-tablet.webp")}
              />
              <source
                media="(max-width: 400px )"
                srcset=${resolveUrl("/images/yellow-mobile.webp")}
              />
              <img
                loading="lazy"
                src=${resolveUrl("/images/yellow-desktop.webp")}
                alt="a woman with a yellow sweather"
                style="
                object-fit: cover;
                object-position: center;
                width: 100%;
                height: 100%;
              "
              />
            </picture>
          </sn-img>
          <div class="spec-info">
            <h3>Eco-Friendly Choice</h3>
            <p>
              With our sustainable approach, we curate clothing that makes a
              statement of care—care for the planet, and for the art of fashion.
            </p>
            <ul class="spec-features-container">
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="recycle materials"
                    aria-hidden="true"
                    src=${resolveUrl("/recycle-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Recycle Materials</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="low impact dye"
                    aria-hidden="true"
                    src=${resolveUrl("/paint-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Low Impact Dye</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="carbon neutral"
                    aria-hidden="true"
                    src=${resolveUrl("/plant-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Carbon Neutral</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="water conservation"
                    aria-hidden="true"
                    src=${resolveUrl("/water-flash-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Water Conservation</span>
              </li>
            </ul>
          </div>
        </section>
        <section hidden class="tab-panel spec">
          <sn-img class="spec-image">
            <picture>
              <source
                media="(max-width: 956px)"
                srcset=${resolveUrl("/images/black-tablet.webp")}
              />
              <source
                media="(max-width: 400px)"
                srcset=${resolveUrl("/images/black-mobile.webp")}
              />
              <img
                loading="lazy"
                src=${resolveUrl("/images/black-desktop.webp")}
                alt="a black cloth"
                style="
                object-fit: cover;
                object-position: center;
                width: 100%;
                height: 100%;
              "
              />
            </picture>
          </sn-img>
          <div class="spec-info">
            <h3>Uncompromised Comfort</h3>
            <p>
              Our garments are a sanctuary of softness, tailored to drape
              gracefully and allow for freedom of movement.
            </p>
            <ul class="spec-features-container">
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Ergomic Fits"
                    aria-hidden="true"
                    src=${resolveUrl("/shirt-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Ergomic Fits</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Soft-To-The-Touch Fabrics"
                    aria-hidden="true"
                    src=${resolveUrl("/hand-heart-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Soft-To-The-Touch Fabrics</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Breathable Weaves"
                    aria-hidden="true"
                    src=${resolveUrl("/windy-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Breathable Weaves</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Thoughtful Design"
                    aria-hidden="true"
                    src=${resolveUrl("/shapes-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Thoughtful Design</span>
              </li>
            </ul>
          </div>
        </section>
        <section hidden class="tab-panel spec">
          <sn-img class="spec-image">
            <picture>
              <source
                media="(max-width: 956px)"
                srcset=${resolveUrl("/images/chair-tablet.webp")}
              />
              <source
                media="(max-width: 400px )"
                srcset=${resolveUrl("/images/chair-mobile.webp")}
              />
              <img
                loading="lazy"
                src=${resolveUrl("/images/chair-desktop.webp")}
                alt="alt"
                style="
                object-fit: cover;
                object-position: center;
                width: 100%;
                height: 100%;
              "
              />
            </picture>
          </sn-img>
          <div class="spec-info">
            <h3>Built to Last</h3>
            <p>
              Here’s to apparel that you can trust to look as good as new, wear
              after wear, year after year.
            </p>
            <ul class="spec-features-container">
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Reinforced Construction"
                    aria-hidden="true"
                    src=${resolveUrl("/stack-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Reinforced Construction</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Quality Control"
                    aria-hidden="true"
                    src=${resolveUrl("/scales-2-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Quality Control</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Material Resilience"
                    aria-hidden="true"
                    src=${resolveUrl("/shield-star-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Material Resilience</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Warranty and Repair"
                    aria-hidden="true"
                    src=${resolveUrl("/price-tag-2-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Warranty and Repair</span>
              </li>
            </ul>
          </div>
        </section>
        <section hidden class="tab-panel spec">
          <sn-img class="spec-image">
            <picture>
              <source
                media="(max-width: 956px)"
                srcset=${resolveUrl("/images/clothes-tablet.webp")}
              />
              <source
                media="(max-width: 400px )"
                srcset=${resolveUrl("/images/clothes-mobile.webp")}
              />
              <img
                loading="lazy"
                src=${resolveUrl("/images/clothes-desktop.webp")}
                alt="a rack with colourful clothes"
                style="
                object-fit: cover;
                object-position: center;
                width: 100%;
                height: 100%;
              "
              />
            </picture>
          </sn-img>
          <div class="spec-info">
            <h3>Versatile by Design</h3>
            <p>
              Our pieces are a celebration of versatility, offering a range of
              styles that are as perfect for a business meeting as they are for
              a casual brunch.
            </p>
            <ul class="spec-features-container">
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Adaptive Styles"
                    aria-hidden="true"
                    src=${resolveUrl("/rainbow-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Adaptive Styles</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Functional Fashion"
                    aria-hidden="true"
                    src=${resolveUrl("/shirt-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Functional Fashion</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Timeless Aesthetics"
                    aria-hidden="true"
                    src=${resolveUrl("/infinity-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Timeless Aesthetics</span>
              </li>
              <li class="spec-feature">
                <div class="spec-image-container">
                  <img
                    width="30"
                    height="30"
                    alt="Mix-and-Match Potential"
                    aria-hidden="true"
                    src=${resolveUrl("/shapes-line.svg")}
                    loading="lazy"
                  />
                </div>
                <span>Mix-and-Match Potential</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    `;
  }
}

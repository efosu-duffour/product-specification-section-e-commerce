import { customElement, state } from "lit/decorators.js";
import { css, html, LitElement } from "lit";
import {
  Collection,
  CollectionsService,
} from "../../../services/collections.service";
import { repeat } from "lit/directives/repeat.js";
import "../shared/Galleries/image.component";
import "../shared/Links/base-link/base-link.component";

@customElement("sn-collections")
export class SNCollections extends LitElement {
  private _collectionsService: CollectionsService = new CollectionsService();

  static styles = [
    css`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      sn-img::part(img) {
        height: 100%;
        width: 100%;

        filter: brightness(0.5);
        will-change: filter, scale;

        transition: all 400ms ease-in-out;
      }

      section {
        display: grid;
        row-gap: 10px;
        container-type: inline-size;
        container-name: collection-section;

        @container (max-width: 450px) {
          .collections-container {
            grid-template-columns: 1fr;
            column-gap: 0px;
            row-gap: 30px;
          }
        }
      }

      .collections-container {
        --row-gap: 20px;
        --container-height: 250px;

        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: repeat(2, var(--container-height));
        width: 100%;
        height: fit-content;

        row-gap: var(--row-gap);
        column-gap: var(--row-gap);
        isolation: isolate;

        li:nth-of-type(2),
        li:nth-of-type(3) {
          grid-column: initial;
        }

        @media (hover: hover) {
          &:has(.collection:hover) {
            & .collection:not(:hover) sn-img::part(img) {
              filter: brightness(0.2);
            }

            & .collection:not(:hover) .label {
              opacity: 0;
            }
          }
        }
      }

      li {
        border-radius: 10px;
        overflow: hidden;
        list-style: none;

        &:nth-of-type(1) {
          grid-row: span 2;
          height: calc(2 * var(--container-height) + var(--row-gap));
        }

        &:nth-of-type(2),
        &:nth-of-type(3) {
          height: var(--container-height);
          grid-column: 2 / 3;
        }
      }

      .collection {
        position: relative;

        @media (hover: hover) {
          .label .description {
            height: 0px;
          }

          &:hover,
          &:focus-within {
            .label .name::part(a) {
              font-size: clamp(0.8rem, 5vw, 0.9rem);
            }
            .label .description {
              height: auto;
              height: calc-size(auto, size);
              opacity: 1;
              margin-top: 5px;
            }
          }
        }

        &:hover,
        &:focus-within {
          sn-img::part(img) {
            transform: scale(1.1);
            filter: brightness(0.8);
          }
        }
      }

      sn-link::part(a)::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
      }

      .label {
        position: absolute;
        padding: clamp(10px, 5%, 25px);
        color: #ffffff;
        inset: 0;

        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        font-size: clamp(0.7rem, 4vw, 0.8rem);
        will-change: opacity;
        @media (prefers-reduced-motion: no-preference) {
          transition: opacity 200ms ease-in-out;
        }

        .name::part(a) {
          color: inherit;
          font-family: inherit;
          will-change: font-size;
          outline: none;

          &:active {
            background: none;
          }

          @media (hover: hover) {
            font-size: 1.4rem;
          }
        }

        .name::part(a):active {
          background-color: unset;
        }

        .description {
          font-size: clamp(0.9rem, 5vw, 1rem);
          font-weight: 500;
          will-change: height;
          margin-top: 5px;

          @media (hover: hover) {
            overflow: hidden;
            height: 0px;
            margin-top: 0px;
            opacity: 0;
          }

          @media (prefers-reduced-motion: no-preference) {
            transition: height 400ms ease-in-out, margin-top 400ms ease-in-out;
          }
        }
      }
    `,
  ];

  @state()
  private _collections: Collection[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this._collectionsService
      .init()
      .then((collections) => {
        this._collections = collections;
      })
      .catch((err) => console.warn(err));
  }

  private _collectionComponent(collection: Collection) {
    return html`
      <li class="collection">
        <sn-img src=${collection.image_url} alt=${collection.name}></sn-img>
        <div class="label">
          <sn-link class="name">${collection.name}</sn-link>
          <span class="description">${collection.description}</span>
        </div>
      </li>
    `;
  }

  private _placeholders() {
    return html` <li></li> `;
  }

  protected render() {
    const isLoaded: boolean = this._collections.length !== 0;
    return html`
      <section>
        <h2>Our Collections</h2>
        <ul class="collections-container">
          ${isLoaded
            ? repeat(
                this._collections,
                (collection) => collection.collection_id,
                (collection) => this._collectionComponent(collection)
              )
            : repeat(
                [1, 2, 3],
                (val) => val,
                () => this._placeholders()
              )}
        </ul>
      </section>
    `;
  }
}

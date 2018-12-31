/**
 * `plutonium-pagination`
 * Pagination component based Polymer.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './plutonium-pagination-icons.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

class PlutoniumPagination extends PolymerElement {
  static get template() {
    return html`
        <style include="shared-styles">
            :host {
                display: block;
                font-size: 14px;
            }

            div.paginator-page-container {
                display: block;
                @apply --layout-horizontal;
                @apply --layout-center;
                @apply --layout-center-justified;
                @apply --layout-center-center;
            }

            :host paper-button {
                margin: 0px 4px;
                padding: 2px 8px;
                /*margin: 0px;*/
                display: inline-block;
                position: relative;
                min-width: fit-content;

            }

            :host paper-button {
                color: var(--primary-text-color);
                background-color: transparent;
                border-radius: 16px;
            }

            :host span {
                margin: 0px 4px;
            }
        </style>

        <div class="paginator-page-container" hidden="[[!hasPage]]">
            <paper-icon-button icon="plutonium-pagination-icons:fast-rewind" on-tap="onBegin" hidden="[[!hasBefore]]"></paper-icon-button>
            <paper-icon-button icon="plutonium-pagination-icons:navigate-before" on-tap="onBefore" hidden="[[!hasBefore]]"></paper-icon-button>
            <span>Page</span>
            <template is="dom-repeat" items="[[items]]" id="palette">
                <paper-button raised="[[!isCurrent(item, page)]]" disabled="[[isCurrent(item, page)]]" on-tap="onChange">
                    [[item]]
                </paper-button>
            </template>
            <span>of</span>
            [[pages]]
            <paper-icon-button icon="plutonium-pagination-icons:navigate-next" on-tap="onNext" hidden="[[!hasNext]]"></paper-icon-button>
            <paper-icon-button icon="plutonium-pagination-icons:fast-forward" on-tap="onEnd" hidden="[[!hasNext]]"></paper-icon-button>
        </div>
  `;
  }

  static get is() {
      return 'plutonium-pagination';
  }

  static get properties() {
      return {
          /** Per-page limit of the elements. */
          limit: {
              type: Number,
              notify: true
          },
          /** Total count of the elements. */
          total: {
              type: Number,
              notify: true
          },
          /** Current page. */
          page: {
              type: Number,
              notify: true,
              value: () => 1
          },
          /** Count of the pages displayed before or after the current page. */
          size: {
              type: Number,
              notify: true,
              value: () => 2
          },
          /** Number of paginated pages. */
          pages: {
              type: Number,
              notify: true
          },
          /** Has pages before the current page. */
          hasBefore: {
              type: Boolean,
              computed: 'computeBefore(page, pages)'
          },
          /** Has pages after the current page. */
          hasNext: {
              type: Boolean,
              computed: 'computeNext(page, pages)'
          },
          /** Has pages. */
          hasPages: {
              type: Boolean,
              computed: 'computeHasPage(items.length, total)'
          },
          /** Displayed page elements */
          items: {
              type: Array,
              notify: true
          }
      };
  }

  static get observers() {
      return [
          'observePageCount(page, limit, total)',
      ];
  }

  computeBefore(page, pages) {
      return page > 1;
  }

  computeNext(page, pages) {
      return page < pages;
  }

  computeHasPage(itemsLength, total) {
      return itemsLength < total;
  }

  observePageCount(page, limit, total) {
      if (limit && total) {
          this.set('pages', parseInt(Math.ceil(parseFloat(total) / parseFloat(limit))));
      }

      if (page && limit && total) {
          let items = [];
          let firstIndex = this._firstIndex(page, this.get('size'));
          let lastIndex = this._lastIndex(page, this.get('size'));
          for (var num = firstIndex; num <= lastIndex; num++) {
              items.push(num);
          }
          this.set('items', items);
          console.log('paginated', page, 'from', firstIndex, 'to', lastIndex, limit, '/', this.get('pages'), ':', items);


      }


  }

  _firstIndex(page, size) {
      let index = page - size;
      if (index < 1) {
          return 1;
      } else {
          return index;
      }
  }

  _lastIndex(page, size) {
      let index = page + size;
      if (index > this.get('pages')) {
          return this.get('pages');
      } else {
          return index;
      }
  }

  isCurrent(index, page) {
      return index === page;
  }

  onChange(event) {
      this.set('page', event.model.item);
      console.log(this.id, 'pagination changed to', this.page);
      this.$.palette.render();
      // this.observePageCount(this.page, this.limit, this.total);
  }

  onBefore(event) {
      this.set('page', this.get('page') > 0 ? this.get('page') - 1 : 1);
  }

  onNext(event) {
      this.set('page', this.get('page') < this.get('pages') ? this.get('page') + 1 : this.get('pages'));
  }
  onBegin(event) {
      this.set('page', 1);
  }

  onEnd(event) {
      this.set('page', this.get('pages'));
  }
}

window.customElements.define(PlutoniumPagination.is, PlutoniumPagination);

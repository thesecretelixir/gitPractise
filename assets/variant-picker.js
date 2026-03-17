/**
 * variant-picker.js
 * Handles:
 *  - Clicking a variant card → updates selected state + hidden input
 *  - Dispatches a custom 'variant:changed' event so other sections
 *    (price block, ATC button, images) can react without tight coupling
 *  - Dropdown-style fallback support
 */

(function () {
  'use strict';

  class VariantPicker extends HTMLElement {
    connectedCallback() {
      this._bindCards();
      this._bindDropdowns();
    }

    /* ---- Card (button) style ---- */
    _bindCards() {
      const cards = this.querySelectorAll('.variant-card');
      cards.forEach((card) => {
        card.addEventListener('click', () => this._onCardClick(card));
      });
    }

    _onCardClick(card) {
      if (card.classList.contains('variant-card--sold-out')) return;

      // Deselect all
      this.querySelectorAll('.variant-card').forEach((c) => {
        c.classList.remove('variant-card--selected');
        c.setAttribute('aria-pressed', 'false');
        c.removeAttribute('aria-current');
      });

      // Select clicked
      card.classList.add('variant-card--selected');
      card.setAttribute('aria-pressed', 'true');
      card.setAttribute('aria-current', 'true');

      const variantId = card.dataset.variantId;
      this._updateHiddenInput(variantId);
      this._dispatchChangeEvent(variantId, card.dataset);

      // Update page URL without reload (Shopify standard behaviour)
      const productUrl = this.dataset.productUrl;
      if (productUrl) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variantId);
        window.history.replaceState({}, '', url.toString());
      }
    }

    /* ---- Dropdown style ---- */
    _bindDropdowns() {
      const selects = this.querySelectorAll('.variant-picker__dropdown');
      selects.forEach((select) => {
        select.addEventListener('change', () => this._onDropdownChange());
      });
    }

    _onDropdownChange() {
      const selects = this.querySelectorAll('.variant-picker__dropdown');
      const selectedOptions = Array.from(selects).map((s) => s.value);

      // Find matching variant
      const productData = this._getProductJSON();
      if (!productData) return;

      const matched = productData.variants.find((v) => {
        return v.options.every((opt, i) => opt === selectedOptions[i]);
      });

      if (matched) {
        this._updateHiddenInput(matched.id);
        this._dispatchChangeEvent(matched.id, {
          variantPrice: matched.price,
          variantComparePrice: matched.compare_at_price || 0,
          variantAvailable: matched.available,
        });
      }
    }

    /* ---- Helpers ---- */
    _updateHiddenInput(variantId) {
      const input = this.querySelector('.variant-picker__selected-id');
      if (input) input.value = variantId;

      // Also update any global add-to-cart form input[name="id"]
      const form = document.querySelector('form[action*="/cart/add"]');
      if (form) {
        const idInput = form.querySelector('input[name="id"]');
        if (idInput) idInput.value = variantId;
      }
    }

    _dispatchChangeEvent(variantId, data) {
      const event = new CustomEvent('variant:changed', {
        bubbles: true,
        detail: {
          variantId,
          price: data.variantPrice,
          compareAtPrice: data.variantComparePrice,
          available: data.variantAvailable !== 'false',
          sectionId: this.dataset.sectionId,
        },
      });
      this.dispatchEvent(event);
      document.dispatchEvent(event); // broadcast globally
    }

    _getProductJSON() {
      const scriptTag = document.getElementById(
        `ProductJSON-${this.dataset.productId}`
      );
      if (scriptTag) {
        try { return JSON.parse(scriptTag.textContent); } catch (_) {}
      }
      return null;
    }
  }

  // Register as a custom element wrapping the existing div.variant-picker
  // so existing Liquid markup works without changes.
  // We upgrade the element after DOM ready.
  function upgradeVariantPickers() {
    document.querySelectorAll('.variant-picker').forEach((el) => {
      // Avoid double-upgrade
      if (el._vpUpgraded) return;
      el._vpUpgraded = true;

      // Mix-in VariantPicker behaviour
      const instance = Object.create(VariantPicker.prototype);
      Object.assign(instance, {
        querySelectorAll: el.querySelectorAll.bind(el),
        querySelector: el.querySelector.bind(el),
        dataset: el.dataset,
        dispatchEvent: el.dispatchEvent.bind(el),
      });
      instance.connectedCallback();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', upgradeVariantPickers);
  } else {
    upgradeVariantPickers();
  }

  // Re-run after Shopify Section renders (Theme Editor)
  document.addEventListener('shopify:section:load', upgradeVariantPickers);
})();

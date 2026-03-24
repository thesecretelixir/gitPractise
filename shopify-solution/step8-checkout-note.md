# Checkout Page — Important Limitation

## Can you change the price display in Shopify Checkout?

### Standard Shopify Plans (Basic, Shopify, Advanced)
**No.** Shopify fully controls the checkout page.
You cannot modify the HTML, CSS, or Liquid of the checkout page.
The checkout will always show the **actual sale price** (the price being charged).

### Shopify Plus Plan
**Yes**, partially. You have access to:
- `checkout.liquid` (being deprecated in favour of Checkout Extensibility)
- **Checkout UI Extensions** — build React components that display inside checkout
- You can show a custom message, but you **cannot change the actual line item price display**
  (Shopify locks that for legal/compliance reasons)

---

## What you CAN do in checkout (all plans)

Add an **Order Note** or use **cart attributes** to show messaging:

### Option: Show a banner in cart before checkout
In `sections/main-cart-footer.liquid`, add a notice:

```liquid
{% assign has_original_price_product = false %}
{% for item in cart.items %}
  {% if item.product.tags contains 'original-price-only' %}
    {% assign has_original_price_product = true %}
  {% endif %}
{% endfor %}

{% if has_original_price_product %}
  <div class="cart-notice" style="background:#fff3cd;padding:12px;border-radius:6px;margin-bottom:16px;font-size:14px;">
    <strong>Note:</strong> Prices shown reflect the original MRP.
    Your special discounted price will be applied at checkout.
  </div>
{% endif %}
```

---

## Summary

| Location | Can Modify Price Display? | Solution |
|---|---|---|
| Collection page cards | Yes | Step 1+2+3 (CSS + Liquid) |
| Product page | Yes | Step 3+4 (Liquid + sessionStorage) |
| Cart drawer | Yes | Step D (Liquid tag check) |
| Cart page | Yes | Step C (Liquid tag check) |
| Checkout | No (standard) | Add pre-checkout notice in cart |
| Checkout | Limited (Plus) | Checkout UI Extensions |

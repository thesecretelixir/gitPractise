# How to Find GoKwik's Actual CSS Selectors

The JavaScript in `step9-gokwik-price-override.liquid` has placeholder selectors.
You MUST inspect GoKwik's rendered HTML to find the real class names.

## Steps

1. Open your store on desktop in Chrome/Firefox
2. Add a product from `buy-any-product-99` to the cart
3. Open the GoKwik cart drawer
4. Press **F12** to open DevTools
5. Click the **cursor icon** (Inspector) in DevTools
6. Click on the **sale price** inside the GoKwik cart
7. Note the class names you see in the Elements panel

Example of what you might see:
```html
<span class="gk-item__price--discounted">₹99</span>
<span class="gk-item__price--original">₹299</span>
<span class="gk-badge--discount">70% off</span>
```

Then update the CONFIG object in the script:

```javascript
var CONFIG = {
  salePriceSelectors:  ['.gk-item__price--discounted'],
  compareAtSelectors:  ['.gk-item__price--original'],
  badgeSelectors:      ['.gk-badge--discount'],
  ...
};
```

## Checking if it works

Open DevTools Console and look for:
```
[OriginalPrice] Loaded price map: { 12345678: 29900 }
```

If the map is empty `{}`, the product is either:
- Not tagged with `original-price-only`
- Has no compare_at_price set higher than the price

## GoKwik Dashboard CSS (Alternative)

If GoKwik's merchant dashboard has a **Custom CSS** field, add:

```css
/* Adjust selectors to match your GoKwik version */
.gk-item__price--discounted { display: none !important; }
.gk-item__price--original {
  text-decoration: none !important;
  color: inherit !important;
}
.gk-badge--discount { display: none !important; }
```

This is simpler but you still need to inspect GoKwik to get the real class names.

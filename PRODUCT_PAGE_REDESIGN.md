# Horizon Theme — Product Page Redesign Guide

## What's Changed (Image 1 → Image 2)

| Feature | Before (Image 1) | After (Image 2) |
|---|---|---|
| Variant selector | Simple pill buttons | **Price cards grid** with per-unit price |
| Ratings | None | **Star rating + review count** |
| Loyalty rewards | None | **Coins banner** ("Buy now & earn X Purity Coins") |
| Coupon/offer | None | **Best price coupon** banner |
| Upsell | None | **Add-on widget** (e.g. Testing Kit) |
| App CTA | None | **App download banner** with discount code |
| Share | None | **Share button** (top right) |
| Price display | Basic | **MRP label** + compare-at strikethrough |
| Tagline | None | **Badge strip** under title |

---

## Files in This Package

```
sections/
  main-product.liquid              ← Main product section (replace existing)

snippets/
  product-variant-picker-cards.liquid  ← Price-card variant picker
  product-loyalty-banner.liquid        ← Loyalty coins banner
  product-upsell-widget.liquid         ← Inline upsell / add-on card
  product-app-banner.liquid            ← App download CTA banner

assets/
  product-page-custom.css              ← All custom styles
```

---

## Installation Steps

### Step 1 — Upload files to your theme

**Option A — Shopify Theme Editor (Code)**
1. Go to **Online Store → Themes → ⋯ → Edit code**
2. Upload / replace each file in its matching folder:
   - `sections/main-product.liquid`
   - `snippets/product-variant-picker-cards.liquid`
   - `snippets/product-loyalty-banner.liquid`
   - `snippets/product-upsell-widget.liquid`
   - `snippets/product-app-banner.liquid`
   - `assets/product-page-custom.css`

**Option B — Shopify CLI**
```bash
shopify theme push --only sections/main-product.liquid \
  snippets/product-variant-picker-cards.liquid \
  snippets/product-loyalty-banner.liquid \
  snippets/product-upsell-widget.liquid \
  snippets/product-app-banner.liquid \
  assets/product-page-custom.css
```

---

### Step 2 — Configure section settings in the Theme Editor

1. Go to **Online Store → Themes → Customize**
2. Navigate to any product page
3. Click on **"Product Information"** block in the left panel
4. Configure:

| Setting | What to fill |
|---|---|
| **Tagline** | e.g. `MILK FROM GIR COWS OF GUJARAT \| BILONA-CHURNED \| 70+ QUALITY CHECKS` |
| **Show product rating** | ✓ Enable (requires reviews app — see Step 3) |
| **Show loyalty coins banner** | ✓ Enable if you have a loyalty program |
| **Coupon code** | e.g. `SAVE10` |
| **Best price with coupon** | e.g. `₹1,041` |
| **Show upsell widget** | ✓ Enable |
| **Upsell product handle** | e.g. `ghee-testing-kit` |
| **Show app download banner** | ✓ Enable if you have an app |
| **Google Play Store URL** | Your Play Store link |
| **Apple App Store URL** | Your App Store link |

---

### Step 3 — Set up product metafields (for per-variant pricing labels)

To show per-unit price (e.g. "₹2500/L") on each variant card:

1. Go to **Settings → Custom data → Products → Variants**
2. Add a metafield:
   - **Name:** `Price per unit`
   - **Namespace & key:** `custom.price_per_unit`
   - **Type:** Single line text
3. For each product variant, fill in the value (e.g. `₹2500/L`, `₹2400/L`)

**For ratings** (without a reviews app):
1. Go to **Settings → Custom data → Products**
2. Add:
   - `custom.rating_value` → Decimal number (e.g. `4.4`)
   - `custom.rating_count` → Integer (e.g. `802`)

**For the upsell widget** (alternative to section setting):
1. Go to **Settings → Custom data → Products**
2. Add:
   - `custom.upsell_product` → Product reference

---

### Step 4 — Enable ratings from a reviews app (recommended)

If you use **Judge.me** or **Yotpo**, the section auto-reads:
- `product.metafields.reviews.rating.value`
- `product.metafields.reviews.rating_count`

These are populated automatically once the app is installed.

---

### Step 5 — Set up the Upsell product

1. Create a product in Shopify for your add-on (e.g. "Ghee Adulteration Rapid Testing Kit")
2. Note its **handle** (from the product URL, e.g. `ghee-testing-kit`)
3. Enter the handle in **Theme Editor → Product Information → Upsell product handle**

---

## Variant Card Discount Badge

The red `X% off` badge on variant cards is calculated automatically from the variant's **Compare at price**. To show it:

1. On any product, click a variant
2. Set **Compare at price** higher than the actual price
3. The badge appears automatically

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Variant cards don't update the price | Make sure you haven't removed `quantity-input` web component from the Horizon theme JS |
| Upsell "Add to cart" does nothing | Check browser console; ensure the upsell product handle is correct and the product is published |
| Rating stars don't show | Check metafields are set at the product level; enable "Show product rating" in section settings |
| CSS not loading | Verify `product-page-custom.css` is in the `assets/` folder and the `stylesheet_tag` link in `main-product.liquid` matches the filename exactly |
| Buy Now button missing | The `{{ form \| payment_button }}` tag requires that at least one payment gateway (e.g. Shopify Payments, PayPal) is active on your store |

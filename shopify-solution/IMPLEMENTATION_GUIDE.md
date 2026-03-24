# Show Only Original (Compare-At) Price on `buy-any-product-99` Collection

This solution hides the **sale price** and **% off / Sale badge** on the
`buy-any-product-99` collection page (and optionally on product pages too),
showing only the **Compare-At (original) price**.

---

## How It Works

Shopify adds `compare_at_price` (original price) and `price` (sale price) to
products. By default, when a product is on sale, the theme shows:
- ~~Original price~~ (strikethrough)
- **Sale price** (bold)
- `-30% off` badge

This solution **reverses** that for your specific collection only.

---

## Implementation Steps

### Step 1 — Add a Body Class (theme.liquid)

1. Go to **Shopify Admin > Online Store > Themes > Edit Code**
2. Open `layout/theme.liquid`
3. Find your `<body ...>` opening tag
4. Add this inside the `class="..."` attribute:

```liquid
{% if collection.handle == 'buy-any-product-99' %}collection-original-price-only{% endif %}
```

**Example:**
```liquid
<body class="template-{{ request.page_type }} {% if collection.handle == 'buy-any-product-99' %}collection-original-price-only{% endif %}">
```

---

### Step 2 — Add the CSS

1. In **Edit Code**, open `assets/base.css` (or `assets/theme.css`)
2. Scroll to the **bottom** of the file
3. Copy and paste the entire contents of `step2-collection-original-price.css`

This CSS:
- Hides `.price-item--sale` (the discounted price)
- Removes strikethrough from `.price-item--regular` (compare-at price)
- Hides Sale badge / % off badge

---

### Step 3 — (Optional) Liquid-Level Price Control

If CSS alone isn't enough (e.g., your theme renders sale/regular price
conditionally), replace `snippets/price.liquid` with the contents of
`step3-price-liquid-modified.liquid`.

This Liquid approach:
- Checks `collection.handle == 'buy-any-product-99'`
- Outputs **only** the `compare_at_price` — no sale UI, no badge
- Falls back to regular `price` if no compare-at price exists

---

### Step 4 — (Optional) Product Page Support

When a customer clicks a product card and lands on the product page,
Shopify no longer knows which collection they came from.

To also hide sale price on the product page:
1. Open `layout/theme.liquid`
2. Just before `</body>`, paste the script from `step4-product-page-liquid.liquid`

This uses `sessionStorage` to remember the collection and applies the body
class on the product page too.

---

## Which Steps Do You Need?

| Goal | Steps Required |
|---|---|
| Hide sale price on **collection page cards only** | Step 1 + Step 2 |
| More reliable hiding (Liquid-level) | Step 1 + Step 2 + Step 3 |
| Also hide on **product page** when coming from this collection | Step 1 + Step 2 + Step 4 |
| Everything | Step 1 + 2 + 3 + 4 |

---

## Theme Compatibility

| Theme | Compatible | Notes |
|---|---|---|
| Dawn | Yes | Tested CSS class names |
| Debut | Yes | Minor class name differences possible |
| Prestige / Impulse | Yes | May need CSS class name tweaks |
| Custom themes | Likely | Inspect your price HTML and adjust CSS selectors |

### Finding Your Theme's CSS Selectors
If the CSS doesn't work, right-click a product price on your collection page
> **Inspect Element** > look for the sale price class name and badge class name,
then update `step2-collection-original-price.css` accordingly.

---

## Testing

1. Go to your collection: `yourstore.com/collections/buy-any-product-99`
2. Products that are **on sale** should now show **only the original price**
3. No Sale badge or % off text should be visible
4. All other collection pages should be **unaffected**

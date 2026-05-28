# What was fixed (blank Fiori screen)

This is your `overview` Overview Page (OVP) V4 app, corrected. The blank screen
was caused by an OData **version mismatch** in `manifest.json`.

## 1. Root cause — manifest pointed at a V2 service that doesn't exist here
`webapp/manifest.json` → `sap.app.dataSources.mainService`

| Field          | Before (broken)                  | After (fixed)                    |
| -------------- | -------------------------------- | -------------------------------- |
| `uri`          | `/V2/Northwind/Northwind.svc/`   | `/V4/Northwind/Northwind.svc/`   |
| `odataVersion` | `2.01`                           | `4.0`                            |

Everything else in the project is V4: `metadata.xml` is `Version="4.0"`,
`annotation.xml` references `/V4/.../$metadata`, the model settings use V4-only
options (`autoExpandSelect`, `operationMode: Server`, `earlyRequests`), and both
`ui5.yaml` (proxy) and `ui5-mock.yaml` (mock server) only serve `/V4/...`.

Because the manifest asked for `/V2/...` as a V2 model, the request hit a path
that isn't proxied (→ 404) and a V2 model tried to read V4 metadata. With no
model data, the OVP rendered nothing.

## 2. `disableErrorPage`: `true` → `false`  (sap.ovp)
With this set to `true`, any load failure shows a **blank page** instead of an
error — which is exactly why you saw nothing rather than a message. Set to
`false` so problems are visible while you develop. Flip it back to `true` for the
final polished demo if you prefer.

## 3. Linklist card title: `REPLACE_WITH_TITLE` → `Product Categories`
Cosmetic placeholder left by the generator.

## 4. `webapp/ext/Test/Component.js` — removed `jquery.sap.global` import
That module was removed in modern UI5 (you're on 1.148). Importing it can throw a
module-load error. It was unused, so it's gone.

---

## Heads-up (not changed) — your custom filter vs. MacroFilterBar
`globalFilterControlType` is `MacroFilterBar` (the correct control for a V4 OVP).
But your custom filter pieces are **SmartFilterBar**-style and won't take effect
with a MacroFilterBar:
- `webapp/ext/fragment/Test.fragment.xml` uses `smartfilterbar:ControlConfiguration`
- the `SmartFilterBarControlConfigurationExtension|Customers` view extension in the manifest
- `getCustomFilters` / `getCustomAppStateDataExtension` / `restoreCustomAppStateDataExtension`
  in `webapp/ext/controller/OverViewPageExt.controller.js`

The page will render fine without them. If you want that custom "customer_ID"
field in the filter bar, either (a) switch `globalFilterControlType` to
`SmartFilterBar`, or (b) add the field the MacroFilterBar/Fiori-Elements way.
I left your files untouched so you can decide.

---

## How to run
```
npm install
npm run start-mock     # offline, mock server auto-generates data
# or
npm start              # live Northwind V4 service via proxy
```
The page should now show the filter bar plus your "Product Categories" and
"CustomCard" cards.

---

# Round 2 — cards were empty (page loaded but no content)

After the V4 fix the app loaded, but the cards showed nothing because no UI
annotations or content were defined. Changes:

## annotation.xml — added data-driven UI annotations (rewritten, clean)
Added `UI.HeaderInfo` + `UI.LineItem` for **Customer**, **Product**, and
**Category** so the cards know what to display.
Removed two unused leftovers from the generator: the `Qualifier="main"/"main1"`
Customer annotations (the `main1` one referenced an action `create` that does not
exist in Northwind) and the unused `CustomerDemographic` Contact annotation. No
card referenced them.

## manifest.json — real cards
Replaced the empty linklist card with three working cards:
- `customersTable` — Table card on **Customers** (responds to the CompanyName global filter)
- `productsList` — List card on **Products** (price + stock)
- `categoriesList` — List card on **Categories**
- `Sakthi` — your custom card, kept

Also set `considerAnalyticalParameters: false` (Northwind is not an analytical
service, so leaving it `true` made OVP look for parameters that don't exist).

## ext/Test/new.fragment.xml — custom card content
Your custom card's content fragment was empty, so it drew an empty box. Added a
placeholder text so the card renders visibly. Put your real monitoring widgets
(KPIs, micro charts) there.

## Run
`npm run start-mock` (offline, auto-generated data) or `npm start` (live V4).
You should now see four cards: Customers, Products, Categories, and your custom card.

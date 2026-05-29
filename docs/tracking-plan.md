# GrowthPulse — Tracking Plan

The conversion funnel for the lead-capture landing page, instrumented in PostHog. This page is the source of truth. Implementation files and event payloads must match what's documented here.

> Any new event must be added **both** to the implementation **and** to this file, in the same PR.

**Legend:** `Client` fires from the browser · `Server` fires from the Server Action.

## Conversion funnel

| # | Event |
|---|---|
| 1 | `$pageview` |
| 2 | `section_viewed` |
| 3 | `cta_clicked` |
| 4 | `form_started` |
| 5 | `form_field_completed` |
| 6 | `form_submitted` |
| 7 | `lead_captured` |
| 8 | `thank_you_viewed` |

## Super-properties

Registered on the PostHog client at page load (and passed through on all server events). Every event below carries these in addition to its own properties.

| Property | Type | Source | Example | Notes |
|---|---|---|---|---|
| `ab_variant` | string | SSR via `getHeroVariant()` — registered by `AnalyticsBootstrap` | `"control" \| "variant-b"` | Identifies the hero headline A/B test cohort. |
| `utm_source` | string? | `utm_data` cookie (set by `UTMCapture`) | `"google"` | Only present if the visitor arrived with `utm_source`. |
| `utm_medium` | string? | `utm_data` cookie | `"cpc"` | — |
| `utm_campaign` | string? | `utm_data` cookie | `"q2-launch"` | — |
| `utm_term` | string? | `utm_data` cookie | `"marketing audit"` | — |
| `utm_content` | string? | `utm_data` cookie | `"banner-a"` | — |
| `$current_url`, `$referrer` | string | PostHog autocapture | — | Standard PostHog properties. |

## Events

### `$pageview` — Client

**Fires when:** PostHog autocaptures on route load.

*Purpose: Funnel entry. Also used to scope all session metrics.*

No custom properties (super-properties only).

---

### `experiment_exposed` — Client

**Fires when:** Once per page load, after PostHog init, with the SSR variant.

*Purpose: Confirms the visitor was bucketed into a variant — required for clean experiment analysis.*

| Name | Type | Required | Example | Notes |
|---|---|---|---|---|
| `flag_key` | string | yes | `"hero-headline"` | — |
| `variant` | string | yes | `"variant-b"` | Same value as the `ab_variant` super-property. |

---

### `section_viewed` — Client

**Fires when:** A landing section reaches 70% viewport intersection. Fires once per section per pageview.

*Purpose: Measures content engagement and identifies where visitors drop off before reaching the form.*

| Name | Type | Required | Example | Notes |
|---|---|---|---|---|
| `section` | enum | yes | `"hero" \| "features" \| "social_proof" \| "pricing" \| "cta_form"` | Matches the section component file. |
| `position` | number | yes | `1..5` | Order on the page. |

---

### `cta_clicked` — Client

**Fires when:** Any conversion-pointing button is pressed.

*Purpose: Identifies which CTAs convert to form interaction. Compare locations across variants.*

| Name | Type | Required | Example | Notes |
|---|---|---|---|---|
| `location` | enum | yes | `"hero_primary" \| "hero_secondary" \| "pricing_starter" \| "pricing_growth" \| "pricing_scale" \| "final_submit"` | Where the click happened. |
| `cta_label` | string | yes | `"Get Your Free Diagnostic"` | Visible button text — useful for copy iteration. |

---

### `form_started` — Client

**Fires when:** First interaction with any form field (focus on input or open on select). Fires once per pageview.

*Purpose: Top of the form sub-funnel. Combined with `$pageview` gives form-open rate.*

| Name | Type | Required | Example | Notes |
|---|---|---|---|---|
| `first_field` | enum | yes | `"name" \| "email" \| "company_size" \| "marketing_team_size"` | Which field the user touched first. |

---

### `form_field_completed` — Client

**Fires when:** Field loses focus (input) or value changes (select) with a non-empty value. Once per field per pageview.

*Purpose: Per-field drop-off analysis. Identify the field that breaks the form.*

| Name | Type | Required | Example | Notes |
|---|---|---|---|---|
| `field` | enum | yes | `"name" \| "email" \| "company_size" \| "marketing_team_size"` | — |
| `value` | string? | no | `"11-50"` | Only sent for the two non-PII selects. Omitted for name and email. |

---

### `form_validation_failed` — Client

**Fires when:** The Server Action returns a Zod validation error.

*Purpose: Catches client-side mistakes (bad email, missing select) that block submission.*

| Name | Type | Required | Example | Notes |
|---|---|---|---|---|
| `field` | string | yes | `"email"` | Parsed from the server error string. |
| `message` | string | yes | `"Valid email required"` | — |

---

### `form_submitted` — Client

**Fires when:** User presses the form submit button (before the Server Action result is known).

*Purpose: Intent-to-submit. Pairs with `lead_captured` to measure server-side success rate.*

| Name | Type | Required | Example | Notes |
|---|---|---|---|---|
| `fields_completed_count` | number | yes | `4` | How many fields were completed before submitting. |

---

### `lead_captured` — Server

**Fires when:** The Server Action successfully persists the lead (after Zod parse and `LeadService.createLead`).

*Purpose: The conversion event. Use as the final step in all funnels.*

| Name | Type | Required | Example | Notes |
|---|---|---|---|---|
| `company_size` | enum | yes | `"11-50"` | — |
| `marketing_team_size` | enum | yes | `"3-5"` | — |
| `ab_variant` | string | yes | `"variant-b"` | Echoed on the event (server cannot rely on register). |
| `utm_source, utm_medium, ...` | string? | no | `"google"` | Echoed from the `utm_data` cookie. |

**Side effect:** Also calls `posthog.identify(visitor_id, $set: { email, name, company_size, marketing_team_size, ab_variant, utm_* })`.

---

### `form_abandoned` — Client

**Fires when:** `document visibilitychange→hidden` or `pagehide` after `form_started`, when `form_submitted` has not fired. Fires at most once.

*Purpose: Quantifies abandonment and surfaces which field the user gave up on.*

| Name | Type | Required | Example | Notes |
|---|---|---|---|---|
| `last_field_touched` | string? | no | `"company_size"` | The last field that received focus or a value change. |
| `fields_completed_count` | number | yes | `2` | — |

---

### `thank_you_viewed` — Client

**Fires when:** The `/thank-you` page mounts on the client.

*Purpose: Verifies the redirect path completed. Use as a sanity check vs `lead_captured`.*

No custom properties (super-properties only).

---

## PII handling

Name and email are **never** sent as event properties. They are set once on the person via `posthog.identify()` + `$set` on `lead_captured` (server-side, with `distinctId = visitor_id`). Inputs for name and email carry the `data-ph-no-capture` attribute so PostHog Session Replay masks them.

Categorical select fields (`company_size`, `marketing_team_size`) are non-PII and are sent as event properties on `form_field_completed` and `lead_captured`.

## Naming conventions

- `snake_case`, lowercase, no namespace prefix.
- Event names are past-tense verbs describing what the user did (`section_viewed`, not `view_section`).
- Property names are `noun` or `noun_state` (`location`, `field`, `fields_completed_count`).
- Section IDs match the component files (`hero`, `features`, `social_proof`, `pricing`, `cta_form`).

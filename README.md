# utm-toolkit

A UTM naming convention plus a tiny CLI that builds links to it and rejects links that break it.

Messy UTMs are the quiet reason attribution reports can't be trusted. `LinkedIn`, `linkedin` and `Linkedin` land as three rows. `Social Media` and `social` never get grouped. Fix it at the source: one convention, enforced when the link is made.

## The convention

| Parameter | Rule | Example |
| --- | --- | --- |
| `utm_source` | where the click came from, lowercase | `linkedin`, `newsletter`, `google` |
| `utm_medium` | one value from the approved list | `email`, `social`, `paid-social`, `cpc`, `organic`, `referral`, `affiliate`, `display`, `sms`, `qr`, `partner` |
| `utm_campaign` | `year-month-name`, hyphens only | `2026-10-launch` |
| `utm_content` | which variant, optional | `carousel-a` |
| `utm_term` | paid keyword, optional | `marketing-ops-audit` |

Rules that apply everywhere: lowercase only, hyphens instead of spaces, no special characters, never use UTMs on internal links (they overwrite the real source).

## Use it

Needs Node 18 or newer. No install.

```bash
git clone https://github.com/MarketingOpswithSam/utm-toolkit.git
cd utm-toolkit

# build a clean link
node utm.mjs build --url https://example.com/offer \
  --source linkedin --medium social --campaign 2026-10-launch --content carousel-a

# audit links someone else made
node utm.mjs check "https://example.com/?utm_source=LinkedIn&utm_medium=Social%20Media"
```

`build` lowercases and hyphenates what you give it, then refuses to print a link that still breaks the rules. `check` lists every problem and exits 1, so you can drop it into a QA step before a campaign goes out.

## Make it yours

The approved mediums live in one array at the top of `utm.mjs`. Edit it to match your channels, and keep the list short. Every extra value is another row in your report.

## Licence

MIT.

Built by [Marketing Ops with Sam](https://marketingopswithsam.com).

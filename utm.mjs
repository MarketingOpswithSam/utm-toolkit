#!/usr/bin/env node
// utm-toolkit: build and validate UTM links against one naming convention.
//   node utm.mjs build --url https://example.com/offer --source linkedin --medium social --campaign 2026-10-launch --content carousel-a
//   node utm.mjs check "https://example.com/offer?utm_source=LinkedIn&utm_medium=Social"
// Zero dependencies. Node 18+. Exits 1 if a link breaks the convention.
const MEDIUMS = ['email', 'social', 'paid-social', 'cpc', 'organic', 'referral', 'affiliate', 'display', 'sms', 'qr', 'partner'];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function problems(params) {
  const out = [];
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign'])
    if (!params.get(k)) out.push(`${k} is missing`);
  for (const [k, v] of params) {
    if (!k.startsWith('utm_')) continue;
    if (v !== v.toLowerCase()) out.push(`${k}="${v}" has capitals (analytics treats Email and email as different rows)`);
    if (/\s|%20|\+/.test(v)) out.push(`${k}="${v}" has spaces, use hyphens`);
    else if (!SLUG.test(v.toLowerCase())) out.push(`${k}="${v}" should be lowercase letters, numbers and hyphens`);
  }
  const medium = params.get('utm_medium');
  if (medium && !MEDIUMS.includes(medium.toLowerCase())) out.push(`utm_medium="${medium}" is not in the approved list: ${MEDIUMS.join(', ')}`);
  return out;
}

const [cmd, ...rest] = process.argv.slice(2);
const flag = (n) => {
  const i = rest.indexOf(`--${n}`);
  return i > -1 ? rest[i + 1] : undefined;
};

if (cmd === 'build') {
  const url = flag('url');
  if (!url) { console.error('Need --url'); process.exit(2); }
  const u = new URL(url);
  const map = { source: 'utm_source', medium: 'utm_medium', campaign: 'utm_campaign', content: 'utm_content', term: 'utm_term' };
  for (const [f, k] of Object.entries(map)) if (flag(f)) u.searchParams.set(k, flag(f).trim().toLowerCase().replace(/\s+/g, '-'));
  const errs = problems(u.searchParams);
  if (errs.length) { console.error(errs.map((e) => '  ' + e).join('\n')); process.exit(1); }
  console.log(u.href);
} else if (cmd === 'check') {
  let bad = 0;
  for (const link of rest) {
    const errs = problems(new URL(link).searchParams);
    console.log(`${errs.length ? 'FAIL' : 'ok  '} ${link}`);
    errs.forEach((e) => console.log('       ' + e));
    if (errs.length) bad++;
  }
  process.exit(bad ? 1 : 0);
} else {
  console.error('Usage: utm.mjs build --url ... --source ... --medium ... --campaign ... | utm.mjs check <url> ...');
  process.exit(2);
}

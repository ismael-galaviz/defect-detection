# TODO

Pending items and ideas for the VeritX Vision website. Check items off as they're done, and add new
ones freely — this file is meant as a running scratchpad, not a formal spec (see `docs/SDD.md` for
the technical/design record).

## Open items

- [ ] Wire the contact form to an actual backend or email service (e.g. Formspree) — it currently only
      shows a local "success" message and doesn't send the data anywhere.
- [x] ~~Build the real savings calculator at `#/calculator`~~ — done, built from
      `Guia_Ingeniero_Calidad_ROI.docx`. See the new open item below about its source data.
- [x] ~~Confirm the line-speed example in the ROI guide.~~ — done. Root cause was a real bug, not just
      a mismatch with the guide: the old formula multiplied a speed difference in **m/min** directly by
      **hours/year**, skipping the ×60 min→hour conversion — a genuine unit-consistency error, independent
      of whichever number the source guide printed. Fixed in `CalculatorPage.jsx`'s `CALC.lineSpeed`, and
      simplified the model at the same time: dropped the `unitsPerMeter` × `marginPerUnit` two-step (an
      extra error-prone hop, and an unrelated "unit" concept) in favor of a single `marginPerMeter`
      field — margin per linear meter of fabric produced, consistent with the m²-based framing already
      used in the defect-reduction section. New formula: `(speedAfter − speedBefore) × 60 × hoursPerYear
      × marginPerMeter`. Defaults updated (`marginPerMeter: 0.5`), giving $3,600,000 MXN for that section
      and $4,550,000 MXN total with the other two sections' defaults unchanged. Fields/formula/hint copy
      updated in all three languages (`translations.js`). See SDD §10.16.
- [x] ~~Link the footer's "About"/"Nosotros" label to the `#/about` page~~ — done; also removed the
      unused "Careers"/"Vacantes" footer entry.
- [x] ~~Write and link a real Privacy Policy page~~ — done. New `#/privacy` route (`PrivacyPolicyPage.jsx`),
      content in `translations.js` → `privacyPage` (all three languages), footer link now points to it
      instead of being a plain `<span>`. Covers what's actually collected today (contact form, account
      registration, support tickets, language preference in `localStorage`), no tracking cookies/analytics,
      the `youtube-nocookie.com` embed, and the WhatsApp link being governed by its own policy.
- [ ] Write and link a real Terms of Service page — same situation as the privacy policy above.
- [ ] Load the Inter font — `index.css` requests it first in the font stack, but nothing actually
      links/imports it, so every browser silently falls back to a system font.
- [ ] Confirm the YouTube video (`djK5l04jRoM`) embedded in the Vision A / product description section
      is the final one to use long-term.
- [ ] Hook the contact form's "Schedule a meeting" mode up to a real calendar/availability system.
      Right now `AppointmentPicker` offers a fixed list of business-hour slots (9am–5pm-ish, Mexico
      City time) with no backend — nothing checks whether a slot is actually free, so two visitors
      could "book" the same slot and both would just see a success message. Fine for a prototype, not
      fine for real bookings. See SDD §10.17.
- [ ] Decide what to do with the Demo page (`#/demo`) — it was explicitly removed from the header nav
      (both dropdown and mobile menu) but the page/route itself is still live and reachable by direct
      link. Either restore a nav entry for it, or remove the route/page entirely if it's not needed.
- [x] ~~Add a Login/Register/Password-recovery/Vision-Home customer portal~~ — done, but **entirely
      client-only** (no backend exists or is planned yet). See SDD §14, especially §14.8's "what's real
      vs. simulated" table, before treating any of it as production security.
- [ ] **Give the customer portal a real backend** when/if this becomes a real product feature: an API +
      database (replacing the `localStorage` "auth service" in `auth.js`), a real email service for
      verification/reset links (replacing the on-page "here's your link" dev panels), server-side
      bcrypt/Argon2 password hashing, server-enforced rate limiting, HttpOnly/Secure session cookies, and
      an audit log. This is a much bigger project than the frontend work already done — flag it as such
      rather than trying to bolt real security onto the current simulation. See SDD §14.8.
- [ ] Add the real company LinkedIn URL to the footer's LinkedIn icon — it currently renders as a
      non-clickable placeholder (no `href`) because no URL was provided. See SDD §10.26/§11.
- [ ] Add a file-attachment field to the Vision Home "request technical support" ticket form — skipped
      for now since there's nowhere for an upload to go without a backend. See SDD §14.6.
- [ ] Confirm/record the live Vercel URL for the site (repo was connected to Vercel this round) and add
      it to SDD §1 once known.
- [ ] Confirm the numbers in the "send me these results" calculator panel are what should actually go
      out — it currently just shows a local "we'll email you" success message with no real email sent
      (same no-backend pattern as the contact form). Revisit once/if the contact form gets a real backend
      (first TODO item above) — wiring both at the same time makes sense.

- [x] ~~Revisar "responsiveness" ya que en un iPhone se veía cortada~~ — done. Root cause: `.specs-grid`
      used `1fr` columns (= `minmax(auto, 1fr)`), which can't shrink below the content's min width;
      unbreakable strings like "120m/min" forced the grid (and the whole page) wider than the viewport,
      so iOS Safari zoomed the page out to compensate. Fixed by using `minmax(0, 1fr)` columns and
      `overflow-wrap: break-word` on `.spec-card .val` in `index.css`.

## Notes

_(space for your own annotations)_

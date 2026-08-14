# TODO

Pending items and ideas for the VeritX Vision website. Check items off as they're done, and add new
ones freely — this file is meant as a running scratchpad, not a formal spec (see `docs/SDD.md` for
the technical/design record).

## Open items

- [ ] Wire the contact form to an actual backend or email service (e.g. Formspree) — it currently only
      shows a local "success" message and doesn't send the data anywhere.
- [x] ~~Build the real savings calculator at `#/calculator`~~ — done, built from
      `Guia_Ingeniero_Calidad_ROI.docx`. See the new open item below about its source data.
- [ ] **Confirm the line-speed example in the ROI guide.** The guide's own worked example says
      $2,400,000 MXN/year, but its own formula applied to that example's numbers
      ((100−70) × 4,000 hrs × 0.5 units/m × $20/unit) gives $1,200,000 MXN — exactly half. The live
      calculator uses the formula as written, so it shows $1,200,000 MXN for the default inputs. Please
      confirm which is correct: the formula, or the guide's example number (maybe a units-per-meter or
      per-shift factor was meant to be doubled) — then update `CalculatorPage.jsx`'s `CALC.lineSpeed`
      and/or the `lineSpeed` defaults in `DEFAULTS` accordingly. See SDD §10.16 for the full detail.
- [x] ~~Link the footer's "About"/"Nosotros" label to the `#/about` page~~ — done; also removed the
      unused "Careers"/"Vacantes" footer entry.
- [ ] Write and link a real Privacy Policy page — the footer's "Privacy Policy"/"Aviso de privacidad"
      link is currently a non-functional placeholder. (There's a short inline privacy blurb in the
      contact form's consent checkbox, but no standalone policy page.)
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

## Notes

_(space for your own annotations)_

revisar "responsiveness" ya que en un iphone 17 pro la pagina se ve cortada. 

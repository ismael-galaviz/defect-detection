# TODO

Pending items and ideas for the VeritX Vision website. Check items off as they're done, and add new
ones freely — this file is meant as a running scratchpad, not a formal spec (see `docs/SDD.md` for
the technical/design record).

## Open items

- [ ] Wire the contact form to an actual backend or email service (e.g. Formspree) — it currently only
      shows a local "success" message and doesn't send the data anywhere.
- [ ] Build the real savings calculator at `#/calculator` — currently a "coming soon" placeholder page.
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

## Notes

_(space for your own annotations)_

import { useState } from 'react'

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#use-cases', label: 'Use Cases' },
  { href: '#comparison', label: 'Why VeritX' },
  { href: '#specs', label: 'Specifications' },
  { href: '#contact', label: 'Contact' },
]

function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a href="#" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          VeritX Vision
        </a>
        <nav className="nav-links">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </nav>
        <div className="nav-cta">
          <a href="#contact" className="btn btn-primary">Request a Demo</a>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">AI-Powered Fabric Inspection</span>
          <h1>
            Catch every textile defect. <span className="accent">Cut inspection costs by half.</span>
          </h1>
          <p className="lead">
            VeritX Vision uses real-time computer vision and machine learning to detect
            fabric defects on the production line — delivering enterprise-grade quality
            control at a fraction of the cost of legacy inspection systems.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn btn-primary">Request a Demo</a>
            <a href="#how-it-works" className="btn btn-ghost">See How It Works</a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">99.2%</div>
              <div className="label">Detection accuracy</div>
            </div>
            <div className="hero-stat">
              <div className="num">&lt;48h</div>
              <div className="label">Install &amp; setup time</div>
            </div>
            <div className="hero-stat">
              <div className="num">~50%</div>
              <div className="label">Lower cost vs. legacy systems</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="scan-frame">
            <div className="scan-line" />
            <div className="defect-tag" data-label="Hole 98%" style={{ top: '22%', left: '30%', width: '60px', height: '40px' }} />
            <div className="defect-tag" data-label="Stain 94%" style={{ top: '58%', left: '62%', width: '70px', height: '46px' }} />
          </div>
          <div className="hero-visual-caption">
            <span><span className="dot-live" />Live detection feed</span>
            <span>2 defects flagged · 12 ft roll</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function LogosStrip() {
  return (
    <div className="logos-strip">
      <div className="container">
        <p className="label">Built for modern textile &amp; apparel manufacturers</p>
        <div className="logos-row">
          <span>WEAVEMARK</span>
          <span>NORTHFIBER</span>
          <span>TEXALON</span>
          <span>LOOMWORKS</span>
          <span>CLOTHRA</span>
        </div>
      </div>
    </div>
  )
}

const STEPS = [
  {
    n: '01',
    title: 'Camera & Sensor Capture',
    body: 'High-resolution line-scan cameras mount directly onto existing looms, finishing lines, or final inspection frames — no need to replace your current equipment.',
  },
  {
    n: '02',
    title: 'Real-Time AI Analysis',
    body: 'Our machine learning model analyzes fabric imagery frame by frame, classifying defects such as holes, stains, weaving errors, and shade variation in real time.',
  },
  {
    n: '03',
    title: 'Instant Defect Mapping',
    body: 'Detected defects are logged with position, type, and severity, and mapped onto the roll so operators know exactly where to inspect or cut.',
  },
  {
    n: '04',
    title: 'Reporting & Yield Optimization',
    body: 'Quality data feeds into a dashboard for trend analysis, helping you optimize cut positions, reduce waste, and make data-driven production decisions.',
  },
]

function HowItWorks() {
  return (
    <section id="how-it-works">
      <div className="container">
        <span className="eyebrow">How It Works</span>
        <h2 className="section-title">From raw fabric to actionable quality data</h2>
        <p className="section-sub">
          A simple, four-step pipeline that plugs into your existing production line.
        </p>
        <div className="steps-grid">
          {STEPS.map((s) => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const USE_CASES = [
  {
    icon: '🧵',
    title: 'Fabric Production',
    body: 'Inline inspection during weaving and knitting catches defects at the source — before hours of production compound a single flaw.',
  },
  {
    icon: '🎨',
    title: 'Finishing',
    body: 'Monitor dyeing, coating, and finishing stages for shade variation, streaks, and contamination before fabric moves downstream.',
  },
  {
    icon: '✅',
    title: 'Final Inspection',
    body: 'Full-roll automated inspection before packaging and shipment, with a complete defect map for cutting and grading decisions.',
  },
]

function UseCases() {
  return (
    <section id="use-cases" className="usecases-section">
      <div className="container">
        <span className="eyebrow">Where VeritX Fits</span>
        <h2 className="section-title">Coverage across your entire fabric line</h2>
        <p className="section-sub">
          Deploy at one stage or across the full production flow — the system adapts to your setup.
        </p>
        <div className="usecases-grid">
          {USE_CASES.map((u) => (
            <div className="usecase-card" key={u.title}>
              <div className="usecase-icon">{u.icon}</div>
              <h4>{u.title}</h4>
              <p>{u.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const COMPARE_ROWS = [
  ['AI-based defect classification', true, true],
  ['Real-time inline inspection', true, true],
  ['Typical hardware + software cost', 'Premium / high capex', '~50% lower'],
  ['Install & commissioning time', 'Weeks', '< 48 hours'],
  ['Retrofits onto existing lines', 'Limited', 'Yes, by design'],
  ['Cloud & on-prem deployment options', 'Enterprise-only', 'Included'],
  ['Cut optimization & yield reporting', true, true],
]

function Comparison() {
  return (
    <section id="comparison">
      <div className="container">
        <span className="eyebrow">Why VeritX Vision</span>
        <h2 className="section-title">Enterprise-grade detection, without the enterprise price tag</h2>
        <p className="section-sub">
          Built to match the reliability of established fabric inspection systems while removing
          the cost and complexity barriers that keep AI quality control out of reach for most mills.
        </p>
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Capability</th>
                <th>Legacy Systems</th>
                <th className="col-veritx">VeritX Vision</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(([label, legacy, veritx]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{typeof legacy === 'boolean' ? (legacy ? <span className="check">✓</span> : <span className="cross">—</span>) : legacy}</td>
                  <td className="col-veritx">{typeof veritx === 'boolean' ? (veritx ? <span className="check">✓</span> : <span className="cross">—</span>) : veritx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

const SPECS = [
  { val: '99.2%', label: 'Defect detection accuracy' },
  { val: '≤5mm', label: 'Minimum detectable defect size' },
  { val: 'Up to 120m/min', label: 'Inspection line speed' },
  { val: '15+', label: 'Defect classes identified' },
]

function Specs() {
  return (
    <section id="specs" className="specs-section">
      <div className="container">
        <span className="eyebrow" style={{ background: 'rgba(0,212,255,0.15)' }}>Technical Specifications</span>
        <h2 className="section-title">Precision built for production floors</h2>
        <p className="section-sub">Prototype performance based on internal testing. Full technical datasheet available on request.</p>
        <div className="specs-grid">
          {SPECS.map((s) => (
            <div className="spec-card" key={s.label}>
              <div className="val">{s.val}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-grid">
        <div className="contact-info">
          <span className="eyebrow">Get In Touch</span>
          <h2>Ready to see VeritX Vision on your line?</h2>
          <p>
            Tell us about your production setup and we'll schedule a personalized demo —
            in person or over video — to show how VeritX Vision fits into your process.
          </p>
          <div className="info-row">
            <span className="ico">✉</span>
            <div>
              <div className="t">Email us</div>
              <div className="d">hello@veritxvision.com</div>
            </div>
          </div>
          <div className="info-row">
            <span className="ico">📍</span>
            <div>
              <div className="t">Based in</div>
              <div className="d">Mexico — serving textile manufacturers worldwide</div>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="form-success">
            Thanks for reaching out! We'll get back to you within one business day to schedule your demo.
          </div>
        ) : (
          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-two">
              <div className="form-row">
                <label htmlFor="name">Full name</label>
                <input id="name" type="text" placeholder="Jane Smith" required />
              </div>
              <div className="form-row">
                <label htmlFor="company">Company</label>
                <input id="company" type="text" placeholder="Your mill or company" required />
              </div>
            </div>
            <div className="form-row">
              <label htmlFor="email">Work email</label>
              <input id="email" type="email" placeholder="jane@company.com" required />
            </div>
            <div className="form-row">
              <label htmlFor="stage">Where would you use VeritX Vision?</label>
              <select id="stage" defaultValue="">
                <option value="" disabled>Select a stage</option>
                <option>Fabric production</option>
                <option>Finishing</option>
                <option>Final inspection</option>
                <option>Multiple stages</option>
              </select>
            </div>
            <div className="form-row">
              <label htmlFor="message">Tell us about your line</label>
              <textarea id="message" rows="4" placeholder="Fabric type, line speed, current inspection process..." />
            </div>
            <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>
              Request a Demo
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo">
              <span className="logo-mark" aria-hidden="true" />
              VeritX Vision
            </a>
            <p>AI-powered fabric inspection for modern textile manufacturers. Enterprise-grade quality control, without the enterprise price.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <h5>Product</h5>
              <a href="#how-it-works">How It Works</a>
              <a href="#use-cases">Use Cases</a>
              <a href="#specs">Specifications</a>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <span>About</span>
              <span>Careers</span>
              <a href="#contact">Contact</a>
            </div>
            <div className="footer-col">
              <h5>Legal</h5>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} VeritX Vision. All rights reserved.</span>
          <span>Prototype product — specifications subject to change.</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <Hero />
      <LogosStrip />
      <HowItWorks />
      <UseCases />
      <Comparison />
      <Specs />
      <Contact />
      <Footer />
    </>
  )
}

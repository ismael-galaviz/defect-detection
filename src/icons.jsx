const ICON_PATHS = {
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />,
  link: (
    <>
      <path d="M9 15 15 9" />
      <path d="M10.5 6.5 13 4a4 4 0 1 1 5.5 5.8L16 12" />
      <path d="M13.5 17.5 11 20a4 4 0 1 1-5.5-5.8L8 12" />
    </>
  ),
  sliders: (
    <>
      <line x1="4" y1="7" x2="20" y2="7" />
      <circle cx="9" cy="7" r="2" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="16" cy="12" r="2" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="11" cy="17" r="2" />
    </>
  ),
  weave: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9h16M4 14h16M9 4v16M14 4v16" />
    </>
  ),
  droplet: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />,
  eyeCheck: (
    <>
      <path d="M1.5 7.5S4.7 3.2 9 3.2s7.5 4.3 7.5 4.3-3.2 4.3-7.5 4.3-7.5-4.3-7.5-4.3Z" />
      <circle cx="9" cy="7.5" r="1.9" />
      <circle cx="18.3" cy="17.8" r="4.7" />
      <path d="m16.3 17.8 1.4 1.4 2.8-3" />
    </>
  ),
  pause: (
    <>
      <rect x="7" y="6" width="3.5" height="12" rx="1" />
      <rect x="13.5" y="6" width="3.5" height="12" rx="1" />
    </>
  ),
  tag: (
    <>
      <path d="M12.6 3H5a2 2 0 0 0-2 2v7.6a2 2 0 0 0 .6 1.4l8.4 8.4a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.8L12.6 3Z" />
      <circle cx="8.5" cy="8.5" r="1.4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 22s7-7.4 7-12.5A7 7 0 0 0 5 9.5C5 14.6 12 22 12 22Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M18.4 18.4l-2.1-2.1M7.7 7.7 5.6 5.6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  activity: <path d="M2 12h4l2-7 4 14 2-7h8" />,
  percent: (
    <>
      <path d="M5 19 19 5" />
      <circle cx="7.5" cy="7.5" r="2.3" />
      <circle cx="16.5" cy="16.5" r="2.3" />
    </>
  ),
  cloud: <path d="M6.5 17a3.8 3.8 0 0 1 0-7.6 5 5 0 0 1 9.6-1.7A3.6 3.6 0 0 1 17 17H6.5Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.5 3.7 6 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-6-3.7-9S9.6 5.5 12 3Z" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15 16 9" />
      <circle cx="12" cy="15" r="1.4" />
    </>
  ),
  shield: <path d="M12 3.5 19 6.5v5c0 5-3 8-7 9-4-1-7-4-7-9v-5L12 3.5Z" />,
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <rect x="9" y="2.5" width="6" height="3.5" rx="1" />
      <path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" />
    </>
  ),
  spark: <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />,
}

export function Icon({ name, size = 22 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  )
}

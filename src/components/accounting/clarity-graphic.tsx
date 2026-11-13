/** Original, illustrative geometry. The adjacent approved paragraph explains it. */
export function ClarityGraphic() {
  return (
    <figure className="accounting-clarity-graphic" aria-hidden="true">
      <div className="accounting-clarity-heading">
        <span>Accounting records</span>
        <span className="accounting-clarity-marker" />
      </div>
      <svg viewBox="0 0 600 440" fill="none" focusable="false">
        <defs>
          <mask id="clarity-forward-mask" maskUnits="userSpaceOnUse">
            <path
              data-forecast-reveal
              d="M441 223C472 203 490 159 548 145"
              pathLength="1"
              stroke="white"
              strokeWidth="12"
              strokeDasharray="1"
            />
          </mask>
        </defs>
        <path
          className="clarity-grid"
          d="M24 88H576M24 176H576M24 264H576M24 352H576M100 24V416M200 24V416M300 24V416M400 24V416M500 24V416"
        />
        <rect className="clarity-sheet" x="35" y="53" width="272" height="274" rx="16" />
        <path className="clarity-rule" d="M57 91H285" />
        <path className="clarity-ink" d="M57 75H112M242 75H285" />
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <g data-ledger-row key={row}>
            <rect className="clarity-gold" x="57" y={112 + row * 31} width="7" height="7" rx="1" />
            <path className="clarity-ink" d={`M80 ${116 + row * 31}H${row % 2 ? 172 : 191}`} />
            <path className="clarity-rule" d={`M222 ${116 + row * 31}H280`} />
          </g>
        ))}
        <g data-report-panel>
          <rect className="clarity-sheet clarity-report" x="246" y="129" width="309" height="269" rx="16" />
          <path className="clarity-ink" d="M270 153H328" />
          <path className="clarity-rule" d="M270 169H531M270 272H531M270 309H531M270 346H531" />
          <path className="clarity-report-line" d="M270 254C291 255 306 215 329 222S365 251 389 230S419 233 441 223" />
          <path className="clarity-gold-stroke" d="M270 254C291 255 306 215 329 222S365 251 389 230S419 233 441 223" data-report-line pathLength="1" strokeDasharray="1" />
          <g className="clarity-bars" data-report-bars>
            <rect x="271" y="331" width="24" height="37" rx="3" />
            <rect x="309" y="316" width="24" height="52" rx="3" />
            <rect x="347" y="324" width="24" height="44" rx="3" />
            <rect x="385" y="297" width="24" height="71" rx="3" />
          </g>
          <path className="clarity-rule" d="M447 330H526M447 343H512M447 356H519" />
        </g>
        <path
          className="clarity-gold-stroke clarity-forward"
          d="M441 223C472 203 490 159 548 145"
          strokeDasharray="5 8"
          mask="url(#clarity-forward-mask)"
        />
        <g data-forecast-point>
          <circle className="clarity-point-halo" cx="548" cy="145" r="15" />
          <circle className="clarity-gold" cx="548" cy="145" r="4" />
        </g>
        <circle className="clarity-gold" cx="441" cy="223" r="4" data-report-point />
      </svg>
      <figcaption className="accounting-clarity-caption">
        <span>Reporting</span>
        <span>Budgets and cash forecasts</span>
      </figcaption>
    </figure>
  );
}

export function HeroGoldFrame() {
  return (
    <svg className="accounting-hero-frame" viewBox="0 0 600 400" fill="none" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path className="hero-frame-track" d="M8 138V32Q8 8 32 8H568Q592 8 592 32V368Q592 392 568 392H154" />
      <path data-hero-line d="M8 138V32Q8 8 32 8H568Q592 8 592 32V368Q592 392 568 392H154" pathLength="1" strokeDasharray="1" />
      <g data-hero-accents>
        <path d="M8 161V185M8 197V203M128 392H103" />
        <circle cx="154" cy="392" r="3" />
      </g>
    </svg>
  );
}

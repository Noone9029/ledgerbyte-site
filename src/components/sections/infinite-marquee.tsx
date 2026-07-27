interface InfiniteMarqueeProps {
  items: readonly string[];
}

export function InfiniteMarquee({ items }: InfiniteMarqueeProps) {
  const repeated = [...items, ...items];

  return (
    <div className="marquee" role="region" aria-label={items.join(", ")}>
      <div className="marquee-track" aria-hidden="true">
        {repeated.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            <i />
          </span>
        ))}
      </div>
    </div>
  );
}

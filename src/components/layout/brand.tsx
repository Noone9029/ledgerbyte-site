import Image from "next/image";
import Link from "next/link";

interface BrandProps {
  inverse?: boolean;
}

export function Brand({ inverse = false }: BrandProps) {
  return (
    <Link
      className="brand"
      data-inverse={inverse}
      href="/"
      aria-label="LedgerByte home"
    >
      <span className="brand-mark" aria-hidden="true">
        <Image
          src="/brand/ledgerbyte-mark.png"
          alt=""
          width={48}
          height={48}
          sizes="48px"
        />
      </span>
      <span className="brand-copy">
        <strong>LEDGERBYTE</strong>
        <span>SMART ACCOUNTING</span>
      </span>
    </Link>
  );
}

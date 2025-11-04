import { Facebook, Instagram, Linkedin, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      {/* Global overlay rendered via portal */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity md:hidden"
            onClick={() => setOpen(false)}
          />,
          document.body
        )
      }

      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="LedgerByte Logo"
            className="w-10 h-10 rounded-lg object-contain"
          />
          <div className="text-foreground">
            <div className="font-bold text-lg">LEDGERBYTE</div>
            <div className="text-xs text-muted-foreground">
              SMART ACCOUNTING
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="/"
            className="text-foreground hover:text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="/services"
            className="text-foreground hover:text-primary transition-colors"
          >
            Services
          </a>
          <a
            href="/about-us"
            className="text-foreground hover:text-primary transition-colors"
          >
            About Us
          </a>
          <a
            href="/lets-connect"
            className="text-foreground hover:text-primary transition-colors"
          >
            Let&apos;s Connect
          </a>
          <a
            href="https://blog.ledgerbyte.io"
            className="text-foreground hover:text-primary transition-colors"
          >
            Blog
          </a>
        </nav>

        {/* Social Icons + Mobile Menu */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.facebook.com/p/LedgerByte-61565427584875"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.linkedin.com/company/ledger-byte/posts/?feedView=all"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://www.instagram.com/ledger_byte"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram size={20} />
            </a>
          </div>

          {/* Mobile Popover Menu */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu size={24} />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              side="bottom"
              /*
                The mobile menu popover has been restyled for a sleeker look. We
                give it padding on all sides, increase the border radius,
                reduce the border opacity and add a stronger backdrop blur and
                shadow. These tweaks make the panel feel more like a modal
                overlay rather than a simple dropdown.
              */
              className="w-[320px] sm:w-[380px] px-6 py-5 rounded-3xl border border-border/40 bg-white/90 backdrop-blur-lg shadow-xl"
            >
              <div className="text-lg font-semibold mb-4">Menu</div>
              <nav className="flex flex-col space-y-4">
                <a
                  href="/"
                  className="text-foreground hover:text-primary transition-colors text-lg py-2"
                  onClick={() => setOpen(false)}
                >
                  Home
                </a>
                <a
                  href="/services"
                  className="text-foreground hover:text-primary transition-colors text-lg py-2"
                  onClick={() => setOpen(false)}
                >
                  Services
                </a>
                <a
                  href="/about-us"
                  className="text-foreground hover:text-primary transition-colors text-lg py-2"
                  onClick={() => setOpen(false)}
                >
                  About Us
                </a>
                <a
                  href="/lets-connect"
                  className="text-foreground hover:text-primary transition-colors text-lg py-2"
                  onClick={() => setOpen(false)}
                >
                  Let&apos;s Connect
                </a>

                <div className="flex items-center justify-center space-x-6 pt-4 border-t">
                  <a
                    href="https://www.facebook.com/p/LedgerByte-61565427584875"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Facebook size={24} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/ledger-byte/posts/?feedView=all"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin size={24} />
                  </a>
                  <a
                    href="https://www.instagram.com/ledger_byte"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Instagram size={24} />
                  </a>
                </div>
              </nav>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;

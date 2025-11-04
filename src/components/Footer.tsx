const Footer = () => {
  return (
    <footer className="bg-hero-bg text-hero-text py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">LB</span>
              </div>
              <div>
                <div className="font-bold text-lg">LEDGERBYTE</div>
                <div className="text-xs text-hero-text/70">SMART ACCOUNTING</div>
              </div>
            </div>
            <p className="text-hero-text/70 text-sm">
              Empowering businesses with expert accounting and smart financial solutions.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-hero-text/70">
              <li>
                  Accounting Automation
              </li>
              <li>
                  Licensing &amp; Setup
              </li>
              <li>
                  Virtual CFO
              </li>
              <li>
                  Consultancy Services
              </li>
              <li>
                  Financial Management
              </li>
              <li>
                  Tax &amp; Compliance
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            {/* Link company pages to their relevant routes. Unknown pages are routed to existing pages for now */}
            <ul className="space-y-2 text-sm text-hero-text/70">
              <li>
                <a href="/about-us" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/about-us" className="hover:text-primary transition-colors">
                  Our Team
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-primary transition-colors">
                  UAE Services
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-primary transition-colors">
                  KSA Services
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            {/* Convert the email to a mailto link and link the markets/services to the contact page */}
            <div className="space-y-2 text-sm text-hero-text/70">
              <p>
                <a href="mailto:info@ledgerbyte.io" className="hover:text-primary transition-colors">
                  Email: info@ledgerbyte.io
                </a>
              </p>
              <p>
                  UAE &amp; KSA Markets
              </p>
              <p>
                  Remote Accounting Services
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-hero-text/20 mt-8 pt-8 text-center text-sm text-hero-text/70">
          <p>&copy; 2024 LedgerByte. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
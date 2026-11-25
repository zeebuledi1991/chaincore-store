// Every editable line of the public storefront. Keys are stable and never
// change; the admin dashboard stores overrides in the SiteContent entity, and
// any key without an override falls back to the default below.
export const CONTENT_FIELDS = [
  // Brand & navigation
  { key: "site.brand.name", group: "Brand & navigation", label: "Brand name", default: "CHAINCORE" },
  { key: "site.brand.suffix", group: "Brand & navigation", label: "Brand sub-line", default: "Technologies LLC" },
  { key: "site.nav.home", group: "Brand & navigation", label: "Menu: Home", default: "Home" },
  { key: "site.nav.products", group: "Brand & navigation", label: "Menu: Products", default: "Products" },
  { key: "site.nav.about", group: "Brand & navigation", label: "Menu: About", default: "About Us" },
  { key: "site.nav.privacy", group: "Brand & navigation", label: "Menu: Privacy Policy", default: "Privacy Policy" },
  { key: "site.nav.contact", group: "Brand & navigation", label: "Menu: Contact", default: "Contact Us" },
  { key: "site.nav.custom", group: "Brand & navigation", label: "Menu: Custom Order button", default: "Custom Order" },
  { key: "site.nav.customMobile", group: "Brand & navigation", label: "Mobile menu button", default: "Submit Custom Request" },

  // Footer
  { key: "site.footer.tagline", group: "Footer", label: "Footer tagline", multiline: true, default: "Powering the Future of Digital Innovation. Blockchain software, Flash USDT tooling across BNB Chain, Ethereum, Solana and TRON." },
  { key: "site.footer.status", group: "Footer", label: "Status badge", default: "Network: Active" },
  { key: "site.footer.navigate", group: "Footer", label: "Column heading: Navigate", default: "Navigate" },
  { key: "site.footer.policies", group: "Footer", label: "Column heading: Policies", default: "Policies" },
  { key: "site.footer.contact", group: "Footer", label: "Column heading: Contact", default: "Contact" },
  { key: "site.footer.company", group: "Footer", label: "Company name", default: "ChainCore Technologies LLC" },
  { key: "site.footer.response", group: "Footer", label: "Response note", default: "Business inquiries answered within one business day." },
  { key: "site.footer.copyright", group: "Footer", label: "Copyright line", default: "Copyright © 2026 ChainCore Technologies LLC." },

  // Home — Hero
  { key: "home.hero.badge", group: "Home — Hero", label: "Badge text", default: "ChainCore Technologies LLC" },
  { key: "home.hero.titleLead", group: "Home — Hero", label: "Headline (first part)", default: "Powering the Future of" },
  { key: "home.hero.titleHighlight", group: "Home — Hero", label: "Headline (highlighted words)", default: "Digital Innovation" },
  { key: "home.hero.titleTail", group: "Home — Hero", label: "Headline (after highlight)", default: "." },
  { key: "home.hero.paragraph", group: "Home — Hero", label: "Intro paragraph", multiline: true, default: "Flash USDT Sender 2.0 is an advanced blockchain and solution designed for efficient digital asset transaction for Flash USDT. Supporting BNB Chain, Ethereum, TRON, and Solana, it offers a streamlined, user-friendly experience across multiple blockchain environments. Built by ChainCore Technologies." },
  { key: "home.hero.ctaPrimary", group: "Home — Hero", label: "Main button", default: "Explore Products" },
  { key: "home.hero.ctaSecondary", group: "Home — Hero", label: "Second button", default: "Contact Us" },
  { key: "home.hero.stat1.value", group: "Home — Hero", label: "Stat 1 value", default: "04" },
  { key: "home.hero.stat1.label", group: "Home — Hero", label: "Stat 1 label", default: "Networks" },
  { key: "home.hero.stat2.value", group: "Home — Hero", label: "Stat 2 value", default: "180" },
  { key: "home.hero.stat2.label", group: "Home — Hero", label: "Stat 2 label", default: "Day validation" },
  { key: "home.hero.stat3.value", group: "Home — Hero", label: "Stat 3 value", default: "12" },
  { key: "home.hero.stat3.label", group: "Home — Hero", label: "Stat 3 label", default: "Month license" },
  { key: "home.hero.panelTitle", group: "Home — Hero", label: "Image panel title", default: "Flash Generation Engine" },
  { key: "home.hero.panelStatus", group: "Home — Hero", label: "Image panel status", default: "Live" },
  { key: "home.hero.ticker", group: "Home — Hero", label: "Scrolling strip (comma separated)", multiline: true, default: "BNB Chain, Ethereum, Solana, TRON, Blockchain Integration, High Quality Tool, Multi-Network Validation" },

  // Home — Technology
  { key: "home.tech.label", group: "Home — Technology", label: "Section label", default: "Our Technology" },
  { key: "home.tech.title", group: "Home — Technology", label: "Section heading", default: "Infrastructure engineered for verifiable behaviour." },
  { key: "home.tech.description", group: "Home — Technology", label: "Section paragraph", multiline: true, default: "Every ChainCore product is built around one principle: nothing touches production until its behaviour has been proven in a controlled environment." },
  { key: "home.tech.stackLabel", group: "Home — Technology", label: "Stack label", default: "Stack" },
  { key: "home.tech.stackValue", group: "Home — Technology", label: "Stack value", default: "EVM · SVM · TRON VM" },
  { key: "home.tech.1.title", group: "Home — Technology", label: "Card 1 title", default: "Blockchain Software Development" },
  { key: "home.tech.1.body", group: "Home — Technology", label: "Card 1 text", multiline: true, default: "Smart contract systems, custody tooling and on-chain integrations built to a written specification and reviewed module by module." },
  { key: "home.tech.2.title", group: "Home — Technology", label: "Card 2 title", default: "The Provided USDT" },
  { key: "home.tech.2.body", group: "Home — Technology", label: "Card 2 text", multiline: true, default: "This USDT will work on any wallet or exchange. You can use it on any gambling website and any trading website." },
  { key: "home.tech.3.title", group: "Home — Technology", label: "Card 3 title", default: "Multi-Network Tooling" },
  { key: "home.tech.3.body", group: "Home — Technology", label: "Card 3 text", multiline: true, default: "One interface across BNB Chain, Ethereum, Solana and TRON with shared telemetry, unified reporting and a single audit trail." },

  // Home — Featured products
  { key: "home.products.label", group: "Home — Featured products", label: "Section label", default: "Featured Products" },
  { key: "home.products.title", group: "Home — Featured products", label: "Section heading", default: "Licenses and Flash USDT packages, priced without ambiguity." },
  { key: "home.products.description", group: "Home — Featured products", label: "Section paragraph", multiline: true, default: "A complete software license for production for team's or individual" },
  { key: "home.products.link", group: "Home — Featured products", label: "Link text", default: "All products" },

  // Home — Networks
  { key: "home.networks.label", group: "Home — Networks", label: "Section label", default: "Supported Networks" },
  { key: "home.networks.title", group: "Home — Networks", label: "Section heading", default: "Four blockchains. One consistent software standard" },
  { key: "home.networks.description", group: "Home — Networks", label: "Section paragraph", multiline: true, default: "Choose the network your workflow runs on. Flash packages you select at checkout." },
  { key: "home.networks.caption", group: "Home — Networks", label: "Image caption", multiline: true, default: "All blockchains are monitored with our high tech softwires'." },
  { key: "home.networks.bnb", group: "Home — Networks", label: "BNB Chain text", multiline: true, default: "The low fees cost on this BNB network you use with our software." },
  { key: "home.networks.ethereum", group: "Home — Networks", label: "Ethereum text", multiline: true, default: "Mainnet-transfers and see everything in front of you." },
  { key: "home.networks.solana", group: "Home — Networks", label: "Solana text", multiline: true, default: "Parallelised runtime modelling for high-frequency transaction flows." },
  { key: "home.networks.tron", group: "Home — Networks", label: "TRON text", multiline: true, default: "TRC-20's most powerful product that can produce the Flash on Tron" },

  // Home — Business inquiries
  { key: "home.inquiry.label", group: "Home — Business inquiries", label: "Section label", default: "Business Inquiries" },
  { key: "home.inquiry.title", group: "Home — Business inquiries", label: "Section heading", default: "Custom volumes, enterprise licensing and integration partnerships." },
  { key: "home.inquiry.description", group: "Home — Business inquiries", label: "Section paragraph", multiline: true, default: "Tell us your Flash quantity, target network and delivery requirements. Our engineering team will respond with a scoped proposal." },
  { key: "home.inquiry.ctaPrimary", group: "Home — Business inquiries", label: "Main button", default: "Submit Custom Request" },
  { key: "home.inquiry.ctaSecondary", group: "Home — Business inquiries", label: "Second button", default: "Contact Us" },
  { key: "home.inquiry.directLabel", group: "Home — Business inquiries", label: "Direct line label", default: "Direct line" },
  { key: "home.inquiry.responseLabel", group: "Home — Business inquiries", label: "Response label", default: "Response" },
  { key: "home.inquiry.responseValue", group: "Home — Business inquiries", label: "Response value", default: "< 1 business day" },
  { key: "home.inquiry.paymentsLabel", group: "Home — Business inquiries", label: "Payments label", default: "Payments" },
  { key: "home.inquiry.paymentsValue", group: "Home — Business inquiries", label: "Payments value", default: "Crypto · OxaPay" },
  { key: "home.inquiry.entityLabel", group: "Home — Business inquiries", label: "Entity label", default: "Entity" },
  { key: "home.inquiry.entityValue", group: "Home — Business inquiries", label: "Entity value", default: "LLC · Global" },

  // Products page
  { key: "products.label", group: "Products page", label: "Page label", default: "Product Store" },
  { key: "products.title", group: "Products page", label: "Page heading", default: "Software licenses and Flash USDT packages." },
  { key: "products.description", group: "Products page", label: "Page paragraph", multiline: true, default: "Every price below is the final price in USD. Licenses are delivered by email after payment is verified; Flash packages will be provided on the blockchain you select." },
  { key: "products.badge.payment", group: "Products page", label: "Badge: payment", default: "Server-verified payment" },
  { key: "products.badge.email", group: "Products page", label: "Badge: email", default: "Email delivery" },
  { key: "products.badge.oxapay", group: "Products page", label: "Badge: OxaPay", default: "OxaPay crypto checkout" },
  { key: "products.flagshipBadge", group: "Products page", label: "Flagship badge on licence", default: "Flagship licence" },
  { key: "products.buyNow", group: "Products page", label: "Licence button", default: "Buy now" },
  { key: "products.card.view", group: "Products page", label: "Card link text", default: "View product" },
  { key: "products.card.currency", group: "Products page", label: "Card currency", default: "USD" },
  { key: "products.card.flagship", group: "Products page", label: "Card flagship badge", default: "Flagship" },
  { key: "products.card.units", group: "Products page", label: "Card units text", default: "Flash USDT you'll receive" },

  // Product page
  { key: "product.back", group: "Product page", label: "Back link", default: "All products" },
  { key: "product.included", group: "Product page", label: "Included heading", default: "Included" },
  { key: "product.unitsLabel", group: "Product page", label: "Units label", default: "Simulated units" },
  { key: "product.priceLabel", group: "Product page", label: "Price label", default: "Package price" },
  { key: "product.deliveryTitle", group: "Product page", label: "Delivery heading", default: "Delivery" },
  { key: "product.delivery.license.1", group: "Product page", label: "Licence delivery line 1", multiline: true, default: "License key and receipt emailed after payment is verified." },
  { key: "product.delivery.license.2", group: "Product page", label: "Licence delivery line 2", multiline: true, default: "Software access apk with instructions will be sent after payment verified on network." },
  { key: "product.delivery.license.3", group: "Product page", label: "Licence delivery line 3", multiline: true, default: "Flash USDT validation period: 180 days." },
  { key: "product.delivery.flash.1", group: "Product page", label: "Flash package delivery line 1", multiline: true, default: "Receipt emailed after payment is verified." },
  { key: "product.delivery.flash.2", group: "Product page", label: "Flash package delivery line 2", multiline: true, default: "Flash USDT will be sent within 10 minutes." },
  { key: "product.delivery.flash.3", group: "Product page", label: "Flash package delivery line 3", multiline: true, default: "We will use your selected blockchain." },
  { key: "product.delivery.flash.4", group: "Product page", label: "Flash package delivery line 4", multiline: true, default: "Flash USDT validation period: 180 days." },
  { key: "product.related", group: "Product page", label: "Related products heading", default: "Other products" },
  { key: "product.note", group: "Product page", label: "Flash package note", multiline: true, default: "These packages contain simulated test units only, not genuine transferable USDT. Units are provisioned for testing and simulation workflows in your selected environment and hold no monetary value." },

  // Checkout
  { key: "checkout.total", group: "Checkout", label: "Order total label", default: "Order total" },
  { key: "checkout.currency", group: "Checkout", label: "Currency label", default: "USD" },
  { key: "checkout.environment", group: "Checkout", label: "Blockchain selector label", default: "Testing environment" },
  { key: "checkout.fullName", group: "Checkout", label: "Name label", default: "Full name" },
  { key: "checkout.namePlaceholder", group: "Checkout", label: "Name placeholder", default: "Jordan Reyes" },
  { key: "checkout.email", group: "Checkout", label: "Email label", default: "Email for delivery" },
  { key: "checkout.emailPlaceholder", group: "Checkout", label: "Email placeholder", default: "you@company.com" },
  { key: "checkout.wallet", group: "Checkout", label: "Wallet label", default: "Add wallet address (required)" },
  { key: "checkout.walletPlaceholder", group: "Checkout", label: "Wallet placeholder", default: "Your receiving wallet address" },
  { key: "checkout.buy", group: "Checkout", label: "Buy button", default: "Buy now" },
  { key: "checkout.creating", group: "Checkout", label: "Loading button text", default: "Creating invoice" },
  { key: "checkout.invoiceReady", group: "Checkout", label: "Invoice ready message", multiline: true, default: "Your secure OxaPay invoice is ready. If the payment page did not open automatically, open it below to complete your payment." },
  { key: "checkout.openPayment", group: "Checkout", label: "Open payment button", default: "Open payment page" },
  { key: "checkout.note", group: "Checkout", label: "Security note", multiline: true, default: "Secure checkout hosted by OxaPay. Payment is verified server-side before any licence is issued. Need an invoice first? Email" },
  { key: "checkout.error.name", group: "Checkout", label: "Error: name", default: "Enter your full name." },
  { key: "checkout.error.email", group: "Checkout", label: "Error: email", default: "Enter a valid email address." },
  { key: "checkout.error.blockchain", group: "Checkout", label: "Error: blockchain", default: "Select the blockchain testing environment for this order." },
  { key: "checkout.error.wallet", group: "Checkout", label: "Error: wallet missing", default: "Enter the wallet address for this order." },
  { key: "checkout.error.walletFormat", group: "Checkout", label: "Error: wallet format", default: "Enter a valid wallet address." },
];

export const CONTENT_DEFAULTS = Object.fromEntries(
  CONTENT_FIELDS.map((field) => [field.key, field.default])
);
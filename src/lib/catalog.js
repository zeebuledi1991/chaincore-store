export const BLOCKCHAINS = [
  {
    id: "bnb",
    name: "BNB Chain",
    ticker: "BSC",
    color: "#F3BA2F",
    note: "The low fees cost on this BNB network you use with our software.",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    ticker: "ETH",
    color: "#8A92B2",
    note: "Mainnet-transfers and see everything in front of you.",
  },
  {
    id: "solana",
    name: "Solana",
    ticker: "SOL",
    color: "#9945FF",
    note: "Parallelised runtime modelling for high-frequency transaction flows.",
  },
  {
    id: "tron",
    name: "TRON",
    ticker: "TRX",
    color: "#FF4D4D",
    note: "TRC-20's most powerful product that can produce the Flash on Tron",
  },
];

export const IMAGES = {
  hero: "https://media.base44.com/images/public/6b06b9729db2cddaa3b47d80/19a37223fd6006eaf33cc6b0ca25e9e8_generated_962bfcdf.png",
  license:
    "https://base44.app/api/apps/6b06b9729db2cddaa3b47d80/files/mp/public/6b06b9729db2cddaa3b47d80/d76b3a90db8ea0d05446f4e3c670f0f1_chaincore-license-usdt-transparent.png",
  simulation:
    "https://media.base44.com/images/public/6b06b9729db2cddaa3b47d80/91c914af1e10db5eaecc1fe4a351f8eb_generated_80d51f21.png",
  networks:
    "https://media.base44.com/images/public/6b06b9729db2cddaa3b47d80/6b06ec7968f627af5c8109a64ad81c96_generated_259313c9.jpg",
  facility:
    "https://media.base44.com/images/public/6b06b9729db2cddaa3b47d80/194470f04c894029c6337bd920a1f954_generated_2413bb07.png",
};

export const PRODUCTS = [
  {
    slug: "flash-usdt-sender-2-0-license",
    name: "Complete Software License",
    kind: "license",
    price: 10000,
    priceLabel: "$10,000",
    unitLabel: "USD",
    tag: "Full Platform Access",
    summary:
      "One-year licence for the complete ChainCore software suite: blockchain testing, simulation tooling and multi-network validation in a single deployment.",
    features: [
      "1-year software license.",
      "Unlimited usage within the agreed license scope.",
      "No usage limitations during the license period.",
      "Access to all agreed software features.",
      "180-day validation period for simulation functionality.",
      "Blockchain testing and simulation tools.",
      "Supported environments: BNB Chain, Ethereum, Solana and TRON.",
    ],
    image: IMAGES.license,
    requiresBlockchain: false,
  },
  {
    slug: "flash-usdt-package-a1",
    name: "Flash USDT Package A1",
    kind: "simulation",
    price: 1000,
    priceLabel: "$1,000",
    unitLabel: "USD",
    tag: "Entry Simulation",
    summary:
      "A focused Flash USDT for single-workflow validation and pre-release contract checks.",
    features: [
      "Package price: $1,000.",
      "Simulated test units: 5,000 USDT-equivalent units.",
      "Select one testing environment per order.",
      "Simulated units only — not genuine transferable USDT.",
    ],
    simulatedUnits: 5000,
    image: IMAGES.simulation,
    requiresBlockchain: true,
  },
  {
    slug: "flash-usdt-package-a2",
    name: "Flash USDT Package A2",
    kind: "simulation",
    price: 3000,
    priceLabel: "$3,000",
    unitLabel: "USD",
    tag: "Team Simulation",
    summary:
      "Expanded USDT volume for multi-contract and extended integration runs.",
    features: [
      "Package price: $3,000.",
      "Simulated test units: 17,000 USDT-equivalent units.",
      "Select one testing environment per order.",
      "Simulated units only — not genuine transferable USDT.",
    ],
    simulatedUnits: 17000,
    image: IMAGES.simulation,
    requiresBlockchain: true,
  },
  {
    slug: "flash-usdt-package-a3",
    name: "Flash USDT Package A3",
    kind: "simulation",
    price: 5000,
    priceLabel: "$5,000",
    unitLabel: "USD",
    tag: "Scale Simulation",
    summary:
      "This package is good for small business who trades on multiple trading platforms of gambling websites.",
    features: [
      "Package price: $5,000.",
      "Simulated test units: 28,000 USDT-equivalent units.",
      "Select one testing environment per order.",
      "Simulated units only — not genuine transferable USDT.",
    ],
    simulatedUnits: 28000,
    image: IMAGES.simulation,
    requiresBlockchain: true,
  },
];

export const PRODUCT_BY_SLUG = Object.fromEntries(PRODUCTS.map((p) => [p.slug, p]));

export const SUPPORT_EMAIL = "support@chaincore.store";

export function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}
export const BLOCKCHAINS = [
  {
    id: "bnb",
    name: "BNB Chain",
    ticker: "BSC",
    color: "#F3BA2F",
    note: "High-throughput EVM environment for contract and settlement simulation.",
  },
  {
    id: "ethereum",
    name: "Ethereum",
    ticker: "ETH",
    color: "#8A92B2",
    note: "Mainnet-parity execution for gas, token and contract behaviour testing.",
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
    note: "TRC-20 transfer and resource-accounting validation environments.",
  },
];

export const IMAGES = {
  hero: "https://media.base44.com/images/public/6b06b9729db2cddaa3b47d80/19a37223fd6006eaf33cc6b0ca25e9e8_generated_962bfcdf.png",
  license:
    "https://media.base44.com/images/public/6b06b9729db2cddaa3b47d80/b285750ec8c6bcf757471ec58320a38e_generated_b001e0fb.png",
  simulation:
    "https://media.base44.com/images/public/6b06b9729db2cddaa3b47d80/91c914af1e10db5eaecc1fe4a351f8eb_generated_80d51f21.png",
  networks:
    "https://media.base44.com/images/public/6b06b9729db2cddaa3b47d80/6b06ec7968f627af5c8109a64ad81c96_generated_259313c9.jpg",
  facility:
    "https://media.base44.com/images/public/6b06b9729db2cddaa3b47d80/194470f04c894029c6337bd920a1f954_generated_2413bb07.png",
};

export const PRODUCTS = [
  {
    slug: "complete-software-license",
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
    slug: "simulation-package-1000",
    name: "Simulation Package 1K",
    kind: "simulation",
    price: 1000,
    priceLabel: "$1,000",
    unitLabel: "USD",
    tag: "Entry Simulation",
    summary:
      "A focused testing allocation for single-workflow validation and pre-release contract checks.",
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
    slug: "simulation-package-3000",
    name: "Simulation Package 3K",
    kind: "simulation",
    price: 3000,
    priceLabel: "$3,000",
    unitLabel: "USD",
    tag: "Team Simulation",
    summary:
      "Expanded simulation volume for multi-contract test suites and extended integration runs.",
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
    slug: "simulation-package-5000",
    name: "Simulation Package 5K",
    kind: "simulation",
    price: 5000,
    priceLabel: "$5,000",
    unitLabel: "USD",
    tag: "Scale Simulation",
    summary:
      "Maximum simulation allocation for load testing, stress scenarios and full environment rehearsal.",
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
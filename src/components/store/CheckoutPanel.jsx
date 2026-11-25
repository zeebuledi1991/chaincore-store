import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ArrowRight, ArrowUpRight, Loader2, Lock, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import BlockchainSelector from "@/components/store/BlockchainSelector";
import { createCheckout } from "@/lib/server-fns";
import { SUPPORT_EMAIL } from "@/lib/catalog";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function CheckoutPanel({ product }) {
  const checkout = useServerFn(createCheckout);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [wallet, setWallet] = useState("");
  const [showWallet, setShowWallet] = useState(false);
  const [error, setError] = useState("");
  const [payUrl, setPayUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const requiresBlockchain = product.requiresBlockchain;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setPayUrl("");

    if (name.trim().length < 2) return setError("Enter your full name.");
    if (!EMAIL_RE.test(email.trim())) return setError("Enter a valid email address.");
    if (requiresBlockchain && !blockchain)
      return setError("Select the blockchain testing environment for this order.");
    if (showWallet && wallet.trim() && !/^[A-Za-z0-9:_-]{16,120}$/.test(wallet.trim()))
      return setError("Enter a valid wallet address, or leave the field empty.");

    setLoading(true);
    try {
      const result = await checkout({
        data: {
          productSlug: product.slug,
          name: name.trim(),
          email: email.trim(),
          blockchain: requiresBlockchain ? blockchain : "",
          walletAddress: showWallet ? wallet.trim() : "",
        },
      });
      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      setPayUrl(result.payUrl);
      setLoading(false);
      try {
        window.location.assign(result.payUrl);
      } catch (err) {
        // Embedded previews can block navigation — the payment link below covers that case.
      }
    } catch (err) {
      setError("We could not start checkout. Please try again or email " + SUPPORT_EMAIL + ".");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border/70 bg-card/60 p-6 backdrop-blur"
    >
      <div className="flex items-end justify-between border-b border-border/60 pb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Order total
          </p>
          <p className="mt-1 font-heading text-3xl font-semibold text-foreground">
            {product.priceLabel}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          USD
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {requiresBlockchain && (
          <BlockchainSelector value={blockchain} onChange={setBlockchain} />
        )}

        <div className="space-y-1.5">
          <Label htmlFor="checkout-name" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Full name
          </Label>
          <Input
            id="checkout-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            placeholder="Jordan Reyes"
            className="bg-background/60"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="checkout-email" className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Email for delivery
          </Label>
          <Input
            id="checkout-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@company.com"
            className="bg-background/60"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowWallet((current) => !current)}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
          >
            <Wallet className="h-3.5 w-3.5" />
            {showWallet ? "Remove wallet address" : "Add testnet wallet address (optional)"}
          </button>
          {showWallet && (
            <div className="mt-2 space-y-1.5">
              <Label htmlFor="checkout-wallet" className="sr-only">
                Wallet address
              </Label>
              <Input
                id="checkout-wallet"
                value={wallet}
                onChange={(event) => setWallet(event.target.value)}
                placeholder="Only if your testing workflow requires one"
                className="bg-background/60 font-mono text-xs"
              />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-[13px] leading-relaxed text-foreground/90">{error}</p>
        </div>
      )}

      {payUrl && (
        <div className="mt-4 rounded-md border border-primary/30 bg-primary/5 p-4">
          <p className="text-[13px] leading-relaxed text-foreground/90">
            Your secure OxaPay invoice is ready. If the payment page did not open automatically, open
            it below to complete your payment.
          </p>
          <a
            href={payUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Open payment page
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-md bg-primary px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_45px_-12px_hsl(184_100%_50%/0.9)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating invoice
          </>
        ) : (
          <>
            Buy now
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
        Secure checkout hosted by OxaPay. Payment is verified server-side before any licence is
        issued. Need an invoice first? Email {SUPPORT_EMAIL}.
      </p>
    </form>
  );
}
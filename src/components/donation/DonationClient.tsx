'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Heart, CreditCard, Apple, Globe, 
  CheckCircle2, ArrowRight, ShieldCheck, 
  Users, HandHeart, Sparkles, AlertCircle, XCircle
} from 'lucide-react';

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function DonationClient() {
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState<number | string>(25);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCanceled, setIsCanceled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const currentAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  const isAmountValid = currentAmount >= 5;

  useEffect(() => {
    if (searchParams.get('success')) {
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (searchParams.get('canceled')) {
      setIsCanceled(true);
      setErrorMessage('Payment was canceled. You can try again below.');
    }
  }, [searchParams]);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAmountValid) return;
    
    setIsSubmitting(true);
    setErrorMessage(null);
    setIsCanceled(false);

    try {
      const response = await fetch('/api/donate/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: currentAmount, name, email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Checkout failed');

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 animate-in fade-in zoom-in duration-500">
        <div className="bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-[var(--color-text-main)] mb-4">You're Amazing!</h1>
          <p className="text-xl text-[var(--color-text-muted)] mb-8">
            Thank you for your generous support. 
            Your donation helps us keep OmniTool free for everyone and provides essential aid to needy people.
          </p>
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              Back to Home
            </button>
            <p className="text-sm text-[var(--color-text-muted)] italic">A confirmation email has been sent to the address provided during checkout.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      {/* Left side: Content & Impact */}
      <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6 md:gap-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-full w-fit">
          <HandHeart className="w-4 h-4 text-indigo-600" />
          <span className="text-[10px] sm:text-xs font-bold text-indigo-600 uppercase tracking-widest">Help Us Support Others</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[var(--color-text-main)] leading-[1.1]">
          Keeping Utilities <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Free & Unbound.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--color-text-muted)] leading-relaxed max-w-2xl">
          OmniTool is a community-driven platform. We don't believe in paywalls. 
          Your contribution helps us maintain servers and directly supports humanitarian aid for needy people.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mt-4">
          <div className="p-5 md:p-6 bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-2xl flex items-start sm:flex-col gap-4 sm:gap-0">
            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-emerald-500 flex-shrink-0 sm:mb-4" />
            <div>
              <h3 className="font-bold mb-1 text-sm md:text-base">100% Free Tools</h3>
              <p className="text-xs md:text-sm text-[var(--color-text-muted)]">No subscriptions or hidden limits, ever.</p>
            </div>
          </div>
          <div className="p-5 md:p-6 bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-2xl flex items-start sm:flex-col gap-4 sm:gap-0">
            <Users className="w-8 h-8 md:w-10 md:h-10 text-indigo-500 flex-shrink-0 sm:mb-4" />
            <div>
              <h3 className="font-bold mb-1 text-sm md:text-base">Dignified Impact</h3>
              <p className="text-xs md:text-sm text-[var(--color-text-muted)]">Directly funds food and essentials for the needy.</p>
            </div>
          </div>
          <div className="p-5 md:p-6 bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-2xl flex items-start sm:flex-col gap-4 sm:gap-0">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-amber-500 flex-shrink-0 sm:mb-4" />
            <div>
              <h3 className="font-bold mb-1 text-sm md:text-base">Modern Privacy</h3>
              <p className="text-xs md:text-sm text-[var(--color-text-muted)]">Encrypted transactions on every device.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Donation Form */}
      <div className="lg:col-span-12 xl:col-span-5 relative">
        <form 
          onSubmit={handleDonate}
          className="bg-[var(--color-surface-base)] border border-[var(--color-border-base)] rounded-3xl shadow-2xl p-6 md:p-8 sticky top-32"
        >
          <div className="flex flex-col gap-6 md:gap-8">
            
            {/* Amount Selection */}
            <div>
              <label className="text-[10px] md:text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 block">Select Amount</label>
              <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                {PRESET_AMOUNTS.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-3 md:py-4 rounded-xl font-bold transition-all border-2 text-sm md:text-base ${
                      currentAmount === val 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/25 scale-[1.02]' 
                      : 'bg-[var(--color-background-base)] text-[var(--color-text-muted)] border-[var(--color-border-base)] hover:border-indigo-400'
                    }`}
                  >
                    €{val}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 relative group">
                <input 
                  type="number"
                  placeholder="Custom Amount"
                  min="5"
                  value={typeof amount === 'string' ? amount : ''}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-[var(--color-background-base)] border-2 border-[var(--color-border-base)] rounded-xl py-4 pl-12 pr-4 font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all hover:border-[var(--color-text-muted)]"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</div>
              </div>
              {!isAmountValid && (
                <p className="text-rose-500 text-xs mt-2 font-medium">Minimum donation amount is €5</p>
              )}
            </div>

            {/* Payment Methods */}
            <div>
              <label className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-4 block">Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', icon: CreditCard, label: 'Card' },
                  { id: 'paypal', icon: Globe, label: 'PayPal' },
                  { id: 'apple', icon: Apple, label: 'Pay' },
                ].map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                      selectedMethod === method.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 shadow-sm'
                      : 'bg-transparent border-[var(--color-border-base)] opacity-60 hover:opacity-100 hover:border-gray-400'
                    }`}
                  >
                    <method.icon className={`w-5 h-5 ${selectedMethod === method.id ? 'text-indigo-600' : 'text-[var(--color-text-muted)]'}`} />
                    <span className="text-[10px] font-bold uppercase">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Donor Info */}
            <div className="flex flex-col gap-3">
               <input 
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
               />
               <input 
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[var(--color-background-base)] border border-[var(--color-border-base)] rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>

            {errorMessage && (
              <div className={`p-4 border rounded-xl flex items-center gap-3 animate-in fade-in duration-300 ${
                isCanceled 
                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-600'
                : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30 text-rose-600'
              }`}>
                {isCanceled ? <XCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <span className="text-sm font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !isAmountValid}
              className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                isSubmitting || !isAmountValid
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-1 shadow-indigo-500/25'
              }`}
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  Confirm Donation
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            <p className="text-[10px] text-center text-[var(--color-text-muted)] uppercase tracking-tighter">
              Secure 256-bit SSL Encrypted Payment
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

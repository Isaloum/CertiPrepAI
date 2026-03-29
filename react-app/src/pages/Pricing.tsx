import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

const plans = [
  {
    name: 'Free',
    price: '$0',
    oldPrice: null,
    period: 'forever',
    savings: null,
    color: 'border-gray-200',
    badge: null,
    features: [
      '20 questions per certification',
      'All 12 AWS certifications',
      'Instant explanations included',
      'No sign up needed',
    ],
    cta: 'Start Free',
    ctaStyle: 'bg-gray-900 text-white hover:bg-gray-700',
    action: '/certifications',
  },
  {
    name: 'Monthly',
    price: '$7',
    oldPrice: null,
    period: 'per month',
    savings: null,
    color: 'border-blue-300',
    badge: null,
    features: [
      'All 12 AWS certifications',
      '260 questions per cert (3,120 total)',
      'Timed mock exam per cert (65q, 90 min)',
      'Domain filtering — focus on weak areas',
      'Instant explanations on every answer',
      'Cancel anytime',
    ],
    cta: 'Start Monthly',
    ctaStyle: 'bg-blue-600 text-white hover:bg-blue-700',
    action: '/signup?plan=monthly',
  },
  {
    name: 'Yearly',
    price: '$67',
    oldPrice: '$108',
    period: 'per year',
    savings: '🔥 Save $41 — 38% off monthly',
    color: 'border-blue-500',
    badge: '⭐ Most Popular',
    features: [
      'Everything in Monthly',
      'All 12 AWS certifications',
      '260 questions per cert (3,120 total)',
      'Timed mock exams included',
      '~$5.60/month — cancel anytime',
    ],
    cta: 'Lock In Yearly — Save $41',
    ctaStyle: 'bg-blue-700 text-white hover:bg-blue-800',
    action: '/signup?plan=yearly',
  },
  {
    name: 'Lifetime',
    price: '$147',
    oldPrice: '$499',
    period: 'one-time',
    savings: '💡 AWS cert = avg $15K salary boost. We cost $147.',
    color: 'border-amber-400',
    badge: '🔥 Best Value',
    features: [
      'Everything in Yearly',
      'All future certifications included',
      'Pay once, use forever',
      'No recurring fees, ever',
    ],
    cta: 'Get Lifetime Access',
    ctaStyle: 'bg-amber-500 text-white hover:bg-amber-600',
    action: '/signup?plan=lifetime',
  },
]

const faqs = [
  { q: 'Can I try before buying?', a: "Yes — 20 free questions per cert, no sign up needed. See exactly what you're getting before paying." },
  { q: "What's the pass rate for AWS exams?", a: 'AWS exams require 72% or higher. Our questions are scenario-based and match the real exam difficulty.' },
  { q: 'Does Lifetime include future certs?', a: 'Yes. Any new AWS certification we add is included in your Lifetime plan at no extra cost.' },
  { q: 'Can I cancel Monthly or Yearly anytime?', a: 'Yes, cancel from your dashboard with one click. No cancellation fees.' },
  { q: 'Is there a refund policy?', a: "We offer a 7-day money-back guarantee if you're not satisfied." },
]

export default function Pricing() {
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Simple, Honest Pricing</h1>
          <p className="text-gray-500">Start free. Upgrade when you're ready. No tricks.</p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {plans.map((plan) => (
            <div key={plan.name} className={`bg-white rounded-2xl border-2 ${plan.color} p-6 flex flex-col relative`}>
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              )}
              <div className="mb-4">
                <h3 className="font-black text-gray-900 text-lg mb-1">{plan.name}</h3>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                  {plan.oldPrice && (
                    <span className="text-gray-400 text-sm line-through mb-1">{plan.oldPrice}</span>
                  )}
                  <span className="text-gray-400 text-sm mb-1">/{plan.period}</span>
                </div>
                {plan.savings && (
                  <div className="mt-1.5 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg px-2 py-1 leading-snug">
                    {plan.savings}
                  </div>
                )}
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate(plan.action)}
                className={`w-full py-3 font-bold rounded-xl text-sm transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-black text-gray-900 mb-6 text-center">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white border border-gray-200 rounded-xl p-5">
                <p className="font-bold text-gray-900 mb-2 text-sm">{faq.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-black mb-2">Ready to pass your AWS cert?</h2>
          <p className="text-gray-400 mb-6">20 free questions — no credit card, no sign up.</p>
          <button onClick={() => navigate('/certifications')} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">
            Start Practicing Free →
          </button>
        </div>
      </div>
    </Layout>
  )
}

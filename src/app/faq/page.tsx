import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — SRIRAAJ',
  description: 'Frequently asked questions about SRIRAAJ products, ordering, delivery, and more.',
};

const faqs = [
  {
    category: 'Our Products',
    items: [
      { q: 'What is A2 Cow Ghee?', a: 'A2 Cow Ghee is ghee made from the milk of cows that produce A2 beta-casein protein. [ADDITIONAL PRODUCT INFORMATION TO BE PROVIDED]' },
      { q: 'What does cold-pressed mean?', a: 'Cold-pressed oil is extracted by pressing seeds or nuts at low temperatures without the use of heat or chemical solvents. [ADDITIONAL INFORMATION TO BE PROVIDED]' },
      { q: 'What is the Bilona method?', a: '[BILONA METHOD DESCRIPTION TO BE PROVIDED]' },
      { q: 'What is the Kachi Ghani method?', a: '[KACHI GHANI METHOD DESCRIPTION TO BE PROVIDED]' },
      { q: 'Are SRIRAAJ products certified?', a: '[CERTIFICATION INFORMATION TO BE PROVIDED]' },
    ],
  },
  {
    category: 'Ordering & Delivery',
    items: [
      { q: 'How long does delivery take?', a: '[DELIVERY TIMELINE TO BE PROVIDED]' },
      { q: 'Do you deliver across India?', a: '[DELIVERY COVERAGE TO BE PROVIDED]' },
      { q: 'What is the minimum order?', a: '[MINIMUM ORDER DETAILS TO BE PROVIDED]' },
      { q: 'How is the product packaged for delivery?', a: '[PACKAGING DETAILS TO BE PROVIDED]' },
    ],
  },
  {
    category: 'Returns & Refunds',
    items: [
      { q: 'What is your return policy?', a: '[RETURN POLICY TO BE PROVIDED]' },
      { q: 'What if I receive a damaged product?', a: '[DAMAGED PRODUCT POLICY TO BE PROVIDED]' },
      { q: 'How do I request a refund?', a: '[REFUND PROCESS TO BE PROVIDED]' },
    ],
  },
  {
    category: 'Storage & Usage',
    items: [
      { q: 'How should I store ghee?', a: 'Store in a cool, dry place away from direct sunlight. Use a clean, dry spoon. Best consumed within 12 months of manufacture.' },
      { q: 'How should I store cold-pressed oils?', a: 'Store in a cool, dry place. Avoid direct sunlight. Best consumed within 6 months of pressing.' },
      { q: 'Is the ghee suitable for frying?', a: '[USAGE DETAILS TO BE PROVIDED]' },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <section style={{ padding: '80px 0 60px', backgroundColor: 'var(--ivory-dark)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <span className="section-label">FAQ</span>
          <h1 className="section-title" style={{ maxWidth: 500 }}>Frequently Asked Questions</h1>
        </div>
      </section>

      <section style={{ padding: '80px 0', backgroundColor: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {faqs.map((section) => (
              <div key={section.category} style={{ marginBottom: 60 }}>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border-color)' }}>
                  {section.category}
                </h2>
                <div>
                  {section.items.map((faq) => (
                    <div key={faq.q} style={{ borderBottom: '1px solid var(--border-color)', padding: '24px 0' }}>
                      <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 10 }}>
                        {faq.q}
                      </h3>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ padding: '40px', backgroundColor: 'var(--ivory-dark)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>Still have questions?</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>We&apos;re happy to help.</p>
              <a href="/contact" className="btn btn-primary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

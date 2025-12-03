import { useState } from "react";
import Header from "../components/Header";
import { useAppContext } from "../hooks/useAppContext";

interface HelpFAQPageProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export default function HelpFAQ({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
}: HelpFAQPageProps) {
  const { currentUser } = useAppContext();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Browse our selection of fresh fruits, add items to your cart, proceed to checkout, and complete payment. Your order will be delivered to your door within the estimated time.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit/debit cards, digital wallets (Google Pay, Apple Pay), UPI payments, and cash on delivery options.",
    },
    {
      question: "How do I track my delivery?",
      answer:
        "Once your order is confirmed, you'll receive a tracking link. You can see real-time updates of your delivery and contact the driver directly.",
    },
    {
      question: "Are the fruits fresh?",
      answer:
        "Yes! All our fruits are sourced directly from local markets and hand-picked for quality. They're checked again before delivery to ensure freshness.",
    },
    {
      question: "What if I receive damaged fruits?",
      answer:
        "Report any quality issues within 1 hour of delivery with photos. We'll either refund or replace your order at no extra cost.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Express delivery takes 30-45 minutes, standard delivery 1-2 hours, and extended delivery 2-4 hours, depending on your location and distance from us.",
    },
    {
      question: "What areas do you deliver to?",
      answer:
        "We deliver throughout the city including downtown, residential areas, business districts, and suburbs. Check the delivery info page for specific areas.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "You can cancel orders within 5 minutes of placing them for a full refund. After that, cancellation may not be possible as we start preparing your order.",
    },
    {
      question: "Do you offer subscription or bulk discounts?",
      answer:
        "Yes! Orders above ₹1000 get free delivery. Contact us for information about subscription plans and bulk order discounts.",
    },
    {
      question: "How are your fruits stored and transported?",
      answer:
        "All fruits are stored in temperature-controlled environments and transported in insulated containers to maintain freshness and quality throughout delivery.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex flex-col">
      {currentUser && (
        <Header
          photoURL={photoURL}
          onProfileClick={onProfileClick}
          onLogoutClick={onLogoutClick}
        />
      )}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Help & FAQ</h1>
          <p className="text-gray-600">
            Answers to common questions about Revealian
          </p>
        </div>

        {/* Quick Help Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <a
            href="#"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-center"
          >
            <p className="text-2xl mb-2">🚚</p>
            <h3 className="font-semibold text-gray-800">Delivery Help</h3>
          </a>
          <a
            href="#"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-center"
          >
            <p className="text-2xl mb-2">💳</p>
            <h3 className="font-semibold text-gray-800">Payment Issues</h3>
          </a>
          <a
            href="#"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-center"
          >
            <p className="text-2xl mb-2">🍎</p>
            <h3 className="font-semibold text-gray-800">Product Quality</h3>
          </a>
          <a
            href="#"
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow text-center"
          >
            <p className="text-2xl mb-2">👤</p>
            <h3 className="font-semibold text-gray-800">Account</h3>
          </a>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 hover:bg-orange-50 transition-colors flex items-center justify-between"
              >
                <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                <span
                  className={`text-orange-400 text-2xl transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ⋮
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-700 border-t border-gray-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-8 mt-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="mb-6">Our support team is here to assist you 24/7</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-orange-600 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="mailto:support@revealian.com"
              className="border-2 border-white text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Email Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import Header from "../components/Header";
import { useAppContext } from "../hooks/useAppContext";

interface ContactUsPageProps {
  photoURL?: string;
  onProfileClick?: () => void;
  onLogoutClick?: () => void;
}

export default function ContactUs({
  photoURL = "",
  onProfileClick = () => {},
  onLogoutClick = () => {},
}: ContactUsPageProps) {
  const { currentUser } = useAppContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Us</h1>
          <p className="text-gray-600">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Send us a message
            </h2>
            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">📞 Phone</h3>
              <p className="text-gray-600">+91 (555) 123-4567</p>
              <p className="text-gray-500 text-sm mt-2">
                Available Mon-Sun, 8 AM - 10 PM
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">📧 Email</h3>
              <p className="text-gray-600">support@revealian.com</p>
              <p className="text-gray-500 text-sm mt-2">
                We'll respond within 24 hours
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                📍 Address
              </h3>
              <p className="text-gray-600">123 Market Street</p>
              <p className="text-gray-600">Fresh City, FC 12345</p>
              <p className="text-gray-500 text-sm mt-2">
                Visit our local office
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
              <h3 className="text-xl font-bold text-orange-800 mb-2">
                ⏱️ Response Time
              </h3>
              <p className="text-gray-700">
                We aim to respond to all inquiries within 24 hours during
                business hours.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

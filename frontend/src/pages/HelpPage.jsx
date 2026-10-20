import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  MessageCircle,
  Book,
  ArrowRight,
  Search,
  User,
  Calendar,
  CreditCard,
  Shield,
  Settings,
} from 'lucide-react';

const FAQ_SECTIONS = [
  {
    category: 'Getting Started',
    icon: <Book className="w-5 h-5" />,
    color: 'brand',
    items: [
      {
        q: 'What is ChargeSlot?',
        a: 'ChargeSlot is an EV Charging Station Booking System that lets electric vehicle owners find nearby charging stations, check live connector availability, reserve a charging slot in advance, and manage their bookings — all from one web app.',
      },
      {
        q: 'Do I need to create an account to search for stations?',
        a: 'No. You can browse and search all charging stations without logging in. However, to make a booking you must register for a free account.',
      },
      {
        q: 'Is ChargeSlot available outside Gujarat?',
        a: 'Currently ChargeSlot covers stations in Ahmedabad and Gandhinagar as part of the college demo dataset. The platform architecture supports any geographic region and can be extended.',
      },
      {
        q: 'How do I use the demo accounts?',
        a: 'Click "Demo Raj" in the navbar to sign in instantly as a demo customer, or "Demo Admin" to access the admin portal. These one-click shortcuts are provided for college evaluation purposes.',
      },
    ],
  },
  {
    category: 'Booking',
    icon: <Calendar className="w-5 h-5" />,
    color: 'emerald',
    items: [
      {
        q: 'How do I book a charging slot?',
        a: '1. Find a station using the search page.\n2. Click "View & Book" on the station card.\n3. Choose your preferred connector, date, and time.\n4. Confirm the booking — you\'ll receive a unique booking code (e.g. CS-2026-X8K9).',
      },
      {
        q: 'What happens after I book?',
        a: "After confirming, your booking appears under 'My Bookings' with status CONFIRMED. On the day, arrive at the station and present your booking code. The station operator will activate your connector.",
      },
      {
        q: 'Can I cancel a booking?',
        a: 'Yes. Go to My Bookings → select the booking → click Cancel. Cancellations are permitted for bookings in CONFIRMED status that have not yet started.',
      },
      {
        q: 'What connector types are supported?',
        a: 'ChargeSlot stations support CCS2 (Combined Charging System), Type 2 (AC), and CHAdeMO connectors. Each connector is listed with its power rating (kW) on the station details page.',
      },
      {
        q: 'Can two users book the same slot at the same time?',
        a: 'No. ChargeSlot uses atomic MongoDB compound indexes to prevent double-bookings. The system guarantees that once a time slot for a connector is locked, no other booking can overlap.',
      },
    ],
  },
  {
    category: 'Account & Profile',
    icon: <User className="w-5 h-5" />,
    color: 'purple',
    items: [
      {
        q: 'How do I reset my password?',
        a: "Go to Profile Settings (click your avatar → Account Profile → Password & Security) and enter your current password along with your new password. The system uses bcrypt hashing to store passwords securely.",
      },
      {
        q: 'Can I add my vehicle details?',
        a: "Yes. In your Profile page you can add your vehicle registration number and vehicle type. This helps operators identify your EV at the charging bay.",
      },
      {
        q: 'How do I view my booking history?',
        a: "Navigate to My Bookings from the navbar or your Dashboard. All past and upcoming bookings are listed with their status (CONFIRMED, COMPLETED, CANCELLED).",
      },
    ],
  },
  {
    category: 'Payments & Pricing',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'amber',
    items: [
      {
        q: 'How is the price calculated?',
        a: 'Pricing is per kWh and varies per station. When you create a booking, the checkout page shows: Energy Rate (₹/kWh), estimated kWh based on session duration, and the estimated total cost.',
      },
      {
        q: 'When do I pay?',
        a: 'In the current demo version, payment is collected at the station by the operator. The booking page shows the estimated amount. A real-world version would integrate a payment gateway like Razorpay.',
      },
    ],
  },
  {
    category: 'Admin & Operators',
    icon: <Shield className="w-5 h-5" />,
    color: 'rose',
    items: [
      {
        q: 'How do I access the Admin Portal?',
        a: "Admin accounts are created by system administrators. If you have an admin account, click 'Admin Portal' in the navbar after logging in. You can also use 'Demo Admin' for a live preview.",
      },
      {
        q: 'What can admins manage?',
        a: 'Admins have full CRUD access to: Charging Stations, Connectors (by station), All Bookings (across all users), and User Accounts.',
      },
      {
        q: 'How do I add a new station?',
        a: "Go to Admin Portal → Manage Stations → 'Add New Station'. Fill in the station name, city, address, GPS coordinates, pricing, hours, and upload an image URL. Save to publish it to the live directory.",
      },
    ],
  },
  {
    category: 'Technical & Security',
    icon: <Settings className="w-5 h-5" />,
    color: 'slate',
    items: [
      {
        q: 'How is my data secured?',
        a: 'Passwords are hashed with bcrypt (12 rounds). Authentication tokens are JWTs stored in HttpOnly cookies (not accessible by JavaScript), preventing XSS attacks. API routes are protected by middleware.',
      },
      {
        q: 'What happens if the backend is down?',
        a: 'The React frontend will display error messages for failed API calls. In a production Kubernetes deployment, the system uses liveness probes and auto-restarts failed containers to maintain uptime.',
      },
    ],
  },
];

const colorMap = {
  brand: 'bg-brand-50 text-brand-700 border-brand-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
};

const AccordionItem = ({ q, a, isOpen, onToggle }) => (
  <div className="border border-slate-200 rounded-xl overflow-hidden">
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-5 py-4 text-left transition ${
        isOpen ? 'bg-brand-50 text-brand-700' : 'bg-white text-slate-800 hover:bg-slate-50'
      }`}
    >
      <span className="font-semibold text-sm pr-4">{q}</span>
      {isOpen ? (
        <ChevronUp className="w-4 h-4 shrink-0" />
      ) : (
        <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />
      )}
    </button>
    {isOpen && (
      <div className="px-5 py-4 bg-white border-t border-slate-100">
        {a.split('\n').map((line, i) => (
          <p key={i} className="text-sm text-slate-600 leading-relaxed mb-1 last:mb-0">
            {line}
          </p>
        ))}
      </div>
    )}
  </div>
);

const HelpPage = () => {
  const [openItem, setOpenItem] = useState(null); // "sectionIdx-itemIdx"
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState(null); // filter by category

  const toggle = (key) => setOpenItem(openItem === key ? null : key);

  const filteredSections = FAQ_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      const q = searchQuery.toLowerCase();
      return (
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      );
    }),
  })).filter((section) => {
    if (activeSection && section.category !== activeSection) return false;
    return section.items.length > 0;
  });

  const totalResults = filteredSections.reduce((acc, s) => acc + s.items.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-navy-900 via-slate-800 to-brand-900 text-white py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl translate-x-1/3 -translate-y-1/2" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-brand-300" />
            <span>Help Centre • ChargeSlot Docs</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-emerald-300">help you?</span>
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Find answers to common questions about booking, accounts, stations and more.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setOpenItem(null); }}
              placeholder="Search questions (e.g. cancel booking, connector type…)"
              className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white text-slate-800 placeholder-slate-400 text-sm outline-none shadow-card"
            />
          </div>
          {searchQuery && (
            <p className="mt-3 text-xs text-slate-400">
              {totalResults} result{totalResults !== 1 ? 's' : ''} for "{searchQuery}"
            </p>
          )}
        </div>
      </section>

      {/* Category Pills */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveSection(null)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
              activeSection === null
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            All Topics
          </button>
          {FAQ_SECTIONS.map((s) => (
            <button
              key={s.category}
              onClick={() => setActiveSection(activeSection === s.category ? null : s.category)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition border ${
                activeSection === s.category
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {s.icon}
              {s.category}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {filteredSections.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="font-semibold text-lg">No results found</p>
              <p className="text-sm mt-1">Try a different keyword or browse all categories.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveSection(null); }}
                className="mt-4 text-sm font-semibold text-brand-600 hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredSections.map((section, si) => (
              <div key={section.category}>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold mb-5 ${colorMap[section.color]}`}>
                  {section.icon}
                  {section.category}
                </div>
                <div className="space-y-3">
                  {section.items.map((item, ii) => {
                    const key = `${si}-${ii}`;
                    return (
                      <AccordionItem
                        key={key}
                        q={item.q}
                        a={item.a}
                        isOpen={openItem === key}
                        onToggle={() => toggle(key)}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact / Still need help */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy-900 mb-3">Still have questions?</h2>
          <p className="text-slate-600 text-sm mb-8 max-w-md mx-auto">
            If you couldn't find the answer above, feel free to reach out or explore the live demo to see
            ChargeSlot in action.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/stations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow hover:shadow-md transition"
            >
              Try Live Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
            >
              <Zap className="w-4 h-4 text-brand-500" /> About This Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpPage;

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Users,
  ShieldCheck,
  MapPin,
  BatteryCharging,
  Server,
  GitBranch,
  Globe,
  ArrowRight,
  Layers,
  Cpu,
  Database,
} from 'lucide-react';

const TEAM = [
  {
    name: 'Raj Patel',
    role: 'Full Stack Developer',
    avatar: 'R',
    color: 'bg-brand-100 text-brand-700',
    desc: 'React, Node.js, MongoDB design & API architecture.',
  },
];

const TECH_STACK = [
  { label: 'React.js', icon: <Globe className="w-4 h-4" />, desc: 'Component-based UI with Vite & Tailwind CSS', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { label: 'Express.js', icon: <Server className="w-4 h-4" />, desc: 'RESTful API backend with JWT authentication', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { label: 'MongoDB', icon: <Database className="w-4 h-4" />, desc: 'NoSQL document database with Mongoose ODM', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { label: 'Docker', icon: <Layers className="w-4 h-4" />, desc: 'Containerised services with Docker Compose', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: 'Kubernetes', icon: <Cpu className="w-4 h-4" />, desc: 'Orchestrated deployment on K8s cluster', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Git & GitHub', icon: <GitBranch className="w-4 h-4" />, desc: 'Version control and CI-ready code repository', color: 'bg-orange-50 text-orange-700 border-orange-200' },
];

const FEATURES = [
  { icon: <MapPin className="w-6 h-6" />, title: 'Live Station Directory', desc: 'Browse charging stations with real-time connector availability powered by MongoDB Change Streams.' },
  { icon: <BatteryCharging className="w-6 h-6" />, title: 'Atomic Slot Booking', desc: 'Race-condition-safe reservation engine ensures zero double-bookings using compound indexes and transactional writes.' },
  { icon: <ShieldCheck className="w-6 h-6" />, title: 'Role-Based Access', desc: 'Customer and Admin portals protected by JWT tokens stored in HttpOnly cookies, with bcrypt password hashing.' },
  { icon: <Users className="w-6 h-6" />, title: 'Admin Control Panel', desc: 'Full CRUD for stations, connectors, bookings, and users from a dedicated operator dashboard.' },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-navy-900 via-brand-900 to-emerald-900 text-white py-24 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-brand-300 fill-current" />
            <span>GUNI Mini Project 2026 • CSE Department</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-emerald-300">ChargeSlot</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            ChargeSlot is a full-stack EV Charging Station Booking System built as a college mini-project
            to demonstrate real-world web development using a modern MERN stack, containerisation with Docker,
            and orchestration with Kubernetes.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Our Mission</span>
              <h2 className="text-3xl font-extrabold text-navy-900 mt-2 mb-4">
                Powering the transition to electric mobility
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                ChargeSlot was designed to solve a real-world problem: EV drivers wasting time searching for
                available charging points, and charging operators struggling to manage bookings manually.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6">
                The platform bridges the gap between EV owners and charging infrastructure operators through
                a clean, intuitive booking interface backed by a robust REST API and a MongoDB data layer.
              </p>
              <Link
                to="/stations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow hover:shadow-md transition"
              >
                Explore Stations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '6+', label: 'Charging Stations' },
                { value: '18+', label: 'Connector Ports' },
                { value: '100%', label: 'Uptime SLA' },
                { value: '< 1s', label: 'Booking Response' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center"
                >
                  <p className="text-4xl font-extrabold text-brand-600">{stat.value}</p>
                  <p className="text-xs font-semibold text-slate-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">What We Built</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Core Platform Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                  {feat.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Technology</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Built With Modern Stack</h2>
            <p className="text-slate-500 text-sm mt-2">
              Every technology was chosen to satisfy the college project requirements and real-world industry standards.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TECH_STACK.map((tech) => (
              <div
                key={tech.label}
                className={`flex items-start gap-4 p-5 rounded-2xl border ${tech.color} transition hover:shadow-soft`}
              >
                <div className="mt-0.5 shrink-0">{tech.icon}</div>
                <div>
                  <p className="font-bold text-sm">{tech.label}</p>
                  <p className="text-xs mt-0.5 opacity-80">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">The Builder</span>
            <h2 className="text-3xl font-extrabold text-navy-900 mt-2">Project Team</h2>
          </div>
          <div className="flex justify-center">
            {TEAM.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl border border-slate-200 shadow-soft p-8 flex flex-col items-center gap-4 max-w-sm w-full text-center"
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-extrabold ${member.color} shadow-inner`}
                >
                  {member.avatar}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-xl">{member.name}</p>
                  <p className="text-xs font-semibold text-brand-600 uppercase tracking-wider mt-0.5">{member.role}</p>
                  <p className="text-sm text-slate-500 mt-3 leading-relaxed">{member.desc}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                  GUNI • CSE • 2026
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-emerald-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to explore ChargeSlot?</h2>
          <p className="text-brand-100 mb-8">
            Try the live demo — book a charging slot in under 60 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/stations"
              className="px-8 py-3.5 rounded-xl bg-white text-brand-700 font-bold hover:bg-brand-50 transition shadow"
            >
              Find Stations
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-white/10 border border-white/30 font-bold hover:bg-white/20 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

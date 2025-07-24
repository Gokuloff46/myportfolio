import React, { useEffect, useState } from 'react';
import { useState as useToggleState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FreelanceCard from '../components/FreelanceCard';
import Cursor from '../components/Cursor';

const Freelance = () => {
  const [gigs, setGigs] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [services, setServices] = useState([]);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const [serviceOpen, setServiceOpen] = useToggleState(false);

  useEffect(() => {
    fetch('/api/freelance')
      .then(res => res.json())
      .then(data => setGigs(Array.isArray(data.freelance) ? data.freelance : []));
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        setPortfolio(data);
        setServices(Array.isArray(data.services) ? data.services : []);
      });
  }, []);

  useEffect(() => {
    // Set cursor visibility based on portfolio data
    if (portfolio && typeof portfolio.showCursor === 'boolean') {
      setIsCursorVisible(portfolio.showCursor);
    }
  }, [portfolio]);

  return (
    <div className={`container mx-auto min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4 ${isCursorVisible ? 'cursor-none' : ''}`}>
      {isCursorVisible && <Cursor />}
      <Header
        data={portfolio || { name: '', showBlog: false, showResume: false, contact: {}, socials: [], darkMode: false }}
        handleWorkScroll={() => { window.location.href = '/#work'; }}
        handleAboutScroll={() => { window.location.href = '/#about'; }}
      />
      <section className="flex flex-col items-center text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-300 mt-10 mb-2 drop-shadow-lg tracking-tight">Freelance Gigs</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-6">Explore my freelance projects and the services I offer. Get in touch for collaborations or custom solutions!</p>
      </section>
      <section className="mb-12 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setServiceOpen(!serviceOpen)}>
          <h2 className="text-3xl font-bold mb-6 text-purple-700 dark:text-purple-300 flex items-center gap-2 mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-purple-400 dark:text-purple-200"><path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a5.25 5.25 0 11-7.43-7.43 5.25 5.25 0 017.43 7.43z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5l-4.35-4.35" /></svg>
            Services
          </h2>
          <svg className={`w-6 h-6 transition-transform duration-200 ${serviceOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </div>
        {serviceOpen && (
          <ul className="mb-4 space-y-4 mt-6">
            {services.map(service => (
              <li key={service.id} className="bg-purple-50 dark:bg-slate-700 rounded-lg p-4 shadow flex flex-col items-start transform transition-transform duration-200 hover:scale-105 hover:bg-purple-100 dark:hover:bg-purple-900 cursor-pointer">
                <span className="font-bold text-lg text-purple-800 dark:text-purple-200">{service.title}</span>
                <span className="text-gray-600 dark:text-gray-300 mt-1">{service.description}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-300 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-blue-400 dark:text-blue-200"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
          Gigs
        </h2>
        {gigs.length === 0 && <div className="text-gray-500 dark:text-gray-400">No freelance gigs yet.</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.filter(gig => gig && typeof gig === 'object' && gig.title).map(gig => <FreelanceCard key={gig.id} gig={gig} />)}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Freelance;

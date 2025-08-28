// src/pages/Dashboard.tsx
import Header from '../components/Header';
import BudgetCard from '../components/BudgetCard';
import Announcements from '../components/Announcements';
import Projects from '../components/Projects';
import Activities from '../components/Activities';
import QuickLinks from '../components/QuickLinks';
import { AuthContext } from '../context/AuthContext';
import MessengerPanel from '../components/MessengerPanel';
import { useContext, useEffect, useState } from 'react';
import GmailPanel from '../components/GmailPanel';


export default function Dashboard() {
  const { logout } = useContext(AuthContext);
  const cardStyle = 'glass-gradient rounded-xl p-4';
  const lightBG = '/LightBG.jpg';
  const darkBG = '/DarkBG.png';
  const [backgroundImage, setBackgroundImage] = useState(
    document.documentElement.classList.contains('dark') ? darkBG : lightBG
  );
  useEffect(() => {
    const updateBG = () => {
      setBackgroundImage(
        document.documentElement.classList.contains('dark') ? darkBG : lightBG
      );
    };
    const observer = new MutationObserver(updateBG);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div 
    className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors"
    style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Header onLogout={logout} />
      <main className="mx-auto w-full max-w-7xl p-2 sm:p-6 space-y-4 sm:space-y-8">
        <div className={cardStyle}><Announcements /></div>
        <div className={cardStyle}><GmailPanel /></div>
        <div className={cardStyle}><MessengerPanel /></div>
        <div className={cardStyle}><BudgetCard /></div>
        <div className={cardStyle}><Projects /></div>
        <div className={cardStyle}><Activities /></div>
        <div className={cardStyle}><QuickLinks /></div>
      </main>
    </div>
  );
}
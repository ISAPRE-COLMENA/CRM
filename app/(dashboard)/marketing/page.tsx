'use client';

import Navbar from '@/components/shared/Navbar';
import EmailCampaignBuilder from '@/components/marketing/EmailCampaignBuilder';
import { Mail } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-[#0076B8] dark:text-blue-400">
            <Mail size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Marketing</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Campañas de correo corporativo automatizadas</p>
          </div>
        </div>
        
        <EmailCampaignBuilder />
      </main>
    </div>
  );
}

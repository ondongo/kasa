import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/Logo';
import { Store, TrendingUp, Package, Clock } from 'lucide-react';

export default async function MerchantsPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/budget-background.png)' }}
        />
      </div>

      {/* Navigation */}
      <nav className="border-b bg-card border-[#2A2520] sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Kasa</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {!session ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-300">Login</Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold rounded-full">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold rounded-full">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Coming Soon Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2A2520] border border-[#F2C086] text-sm font-medium mb-8">
            <Store className="h-4 w-4 text-[#F2C086]" />
            <span className="text-gray-300">Solution for merchants</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight max-w-4xl mx-auto text-white">
            Simplified <span className="text-[#F2C086]">business</span> management
          </h1>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-12">
            Manage your revenue and inventory with ease. 
            A complete solution for merchants.
          </p>

          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2A2520] border-2 border-[#F2C086] mb-12">
            <Clock className="h-5 w-5 text-[#F2C086]" />
            <span className="text-lg font-semibold text-[#F2C086]">Coming soon</span>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
            <div className="bg-card p-6 rounded-2xl border-2 border-[#F2C086]/20">
              <div className="w-12 h-12 rounded-full bg-[#2A2520] flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-[#F2C086]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Revenue Management</h3>
              <p className="text-sm text-gray-400">
                Track all your income and sales in real-time
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border-2 border-[#F2C086]/20">
              <div className="w-12 h-12 rounded-full bg-[#2A2520] flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-[#F2C086]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Inventory Management</h3>
              <p className="text-sm text-gray-400">
                Control your inventory and products easily
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border-2 border-[#F2C086]/20">
              <div className="w-12 h-12 rounded-full bg-[#2A2520] flex items-center justify-center mx-auto mb-4">
                <Store className="h-6 w-6 text-[#F2C086]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dashboard</h3>
              <p className="text-sm text-gray-400">
                Visualize your performance and statistics
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12">
            <p className="text-gray-400 mb-6">
              Be notified when this feature is released
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-[#F2C086] hover:bg-[#F2C086]/90 text-black font-semibold h-12 px-6 text-base rounded-full">
                Create an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2520] py-8 bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-xl font-bold text-white">Kasa</span>
            </Link>
            <p className="text-sm text-gray-400">
              © 2026 Kasa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}




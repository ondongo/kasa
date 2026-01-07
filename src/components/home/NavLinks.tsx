'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLinks() {
  const pathname = usePathname();
  const [activeAnchor, setActiveAnchor] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['faq'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveAnchor(section);
            return;
          }
        }
      }
      setActiveAnchor('');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const isFaqActive = isHome && activeAnchor === 'faq';

  return (
    <>
      <Link href="/">
        <button className={`px-5 py-2 rounded-full font-medium transition-all ${
          pathname === '/' ? 'bg-[#F2C086] text-black' : 'text-gray-300'
        }`}>
          Accueil
        </button>
      </Link>
      <div className="relative group">
        <button className="px-5 py-2 rounded-full text-gray-300 font-medium transition-all flex items-center gap-1">
          Blog
        </button>
      </div>
      <Link href="/pricing">
        <button className={`px-5 py-2 rounded-full font-medium transition-all ${
          pathname === '/pricing' ? 'bg-[#F2C086] text-black' : 'text-gray-300'
        }`}>
          Tarifs
        </button>
      </Link>
      <Link href="/merchants">
        <button className={`px-5 py-2 rounded-full font-medium transition-all ${
          pathname === '/merchants' ? 'bg-[#F2C086] text-black' : 'text-gray-300'
        }`}>
          Commerçants
        </button>
      </Link>
      <a href="#faq">
        <button className={`px-5 py-2 rounded-full font-medium transition-all ${
          isFaqActive ? 'bg-[#F2C086] text-black' : 'text-gray-300'
        }`}>
          FAQ
        </button>
      </a>
    </>
  );
}


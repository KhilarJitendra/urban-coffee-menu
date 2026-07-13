'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, MapPin, MessageCircle } from 'lucide-react';

interface MenuItem {
  name: string;
  description: string;
  price: string;
}

interface MenuData {
  [category: string]: MenuItem[];
}

type TimeOfDay = 'morning' | 'day' | 'evening' | 'night';

interface MenuProps {
  timeOfDay: TimeOfDay;
}

export default function Menu({ timeOfDay }: MenuProps) {
  const [data, setData] = useState<MenuData>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function loadMenu() {
      try {
        const res = await fetch('/api/menu', {
          cache: 'no-cache'
        });
        console.log('respinse', res);
        if (!res.ok) throw new Error('Failed to load menu2');
        const json: MenuData = await res.json();
        const firstCat = Object.keys(json)[0] || '';
        setData(json);
        if (firstCat) setActiveCategory(firstCat);
      } catch (err) {
        console.error('Error loading menu:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const categories = Object.keys(data);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const query = search.toLowerCase();
    const result: MenuData = {};
    categories.forEach(cat => {
      const items = data[cat].filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
      if (items.length > 0) result[cat] = items;
    });
    return result;
  }, [data, search, categories]);

  const filteredCategories = Object.keys(filteredData);

  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    const el = document.getElementById(`category-${cat}`);
    if (el && headerRef.current) {
      const headerH = headerRef.current.offsetHeight;
      const y = el.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ y: '20%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen flex flex-col"
    >
      {/* Sticky header */}
      <header
        ref={headerRef}
        className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border shadow-sm"
        data-testid="menu-header"
      >
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="shrink-0">
              <h1
                className="text-2xl sm:text-3xl font-serif text-foreground leading-tight"
                data-testid="menu-title"
              >
                Urban Coffee
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase">
                More Than Coffee
              </p>
            </div>

            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 rounded-full bg-secondary text-secondary-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                data-testid="input-search"
              />
            </div>
          </div>

          {!search && categories.length > 0 && (
            <div className="mt-2 sm:mt-3 flex overflow-x-auto hide-scrollbar gap-1.5 sm:gap-2 pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`whitespace-nowrap px-3 sm:px-5 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-transparent text-muted-foreground hover:bg-secondary'
                  }`}
                  data-testid={`button-category-${cat}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            <p className="font-serif italic text-sm sm:text-base">Brewing your menu...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-base sm:text-lg">
              No items found for &ldquo;{search}&rdquo;
            </p>
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {filteredCategories.map((cat, idx) => (
              <motion.section
                key={cat}
                id={`category-${cat}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                onViewportEnter={() => { if (!search) setActiveCategory(cat); }}
                data-testid={`section-category-${cat}`}
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-foreground whitespace-nowrap">
                    {cat}
                  </h2>
                  <div className="h-px bg-border flex-1 mt-1" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 lg:gap-7">
                  {filteredData[cat].map((item, itemIdx) => (
                    <motion.div
                      key={`${cat}-${itemIdx}`}
                      whileHover={{ y: -3 }}
                      className="group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-card-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                      data-testid={`card-item-${cat}-${itemIdx}`}
                    >
                      <div>
                        <div className="flex justify-between items-start gap-3 mb-1.5 sm:mb-2">
                          <h3 className="text-sm sm:text-base font-medium text-card-foreground group-hover:text-accent transition-colors leading-snug">
                            {item.name}
                          </h3>
                          <span className="text-sm sm:text-base font-serif font-semibold text-foreground whitespace-nowrap">
                            {item.price}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="font-serif text-lg text-foreground">Urban Coffee Cart</p>
            <p className="text-xs text-muted-foreground mt-1 font-serif italic">
              Great Coffee, Better Breaks, Good Times.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Manav Rachna University, Faridabad</span>
            </div>
          </div>
          <a
            href="https://wa.me/919718227979"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="w-4 h-4" />
            Order on WhatsApp
          </a>
        </div>
      </footer>
    </motion.div>
  );
}

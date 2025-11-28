import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';
import { useState, useEffect } from 'react';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = storage.getCart();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, [location]);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (mode: 'dark' | 'light') => {
      setIsDark(mode === 'dark');
      if (mode === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    };

    if (stored === 'dark' || stored === 'light') {
      applyTheme(stored as 'dark' | 'light');
    } else {
      applyTheme(media.matches ? 'dark' : 'light');
    }

    const onSystemChange = (e: MediaQueryListEvent) => {
      const currentStored = localStorage.getItem('theme');
      if (!currentStored) applyTheme(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    const root = document.documentElement;
    if (next === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    setIsDark(next === 'dark');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient font-logo">FoodHub</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="relative text-foreground hover:bg-primary/20 hover:text-primary"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative text-foreground hover:bg-primary/20 hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      
      <main>{children}</main>
      
      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">Made by Shrayan Dutta</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

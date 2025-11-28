import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SearchBar } from './SearchBar';

const images = [
  // User-selected biryani image
  'https://images.unsplash.com/photo-1710091691777-3115088962c4?auto=format&fit=crop&w=1920&q=80&ixlib=rb-4.1.0',
];

export const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Parallax based on page scroll, not mouse
  const { scrollY } = useScroll();
  const bgOffset = useTransform(scrollY, [0, 400], [0, -60]); // gentle upward shift

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-gradient-to-b from-background to-background/80 -mt-16 pt-16">
      {/* Slideshow layers (no mouse movement) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {images.map((src, idx) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: idx === index ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              willChange: 'opacity, transform',
              translateY: bgOffset as unknown as number,
            }}
          />
        ))}
        {/* Stronger overlay for clear text readability */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          {/* Pinkish gradient headline as requested */}
          <h1 className="mb-6">
            <span className="block text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 drop-shadow-xl">
              Savor India’s Flavors
            </span>
            <span className="mt-2 block text-xl md:text-2xl font-medium text-white">
              Fresh, fast, and right to you
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Discover iconic dishes across regions — from crispy dosas to rich biryanis and sweet jalebis.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <SearchBar iconOnly />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

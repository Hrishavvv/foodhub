import { Hero3D } from '@/components/Hero3D';
import { CategoryCard } from '@/components/CategoryCard';
import { RestaurantCard } from '@/components/RestaurantCard';
import { motion, useScroll, useTransform } from 'framer-motion';
import { categories, mockRestaurants } from '@/lib/mockData';
import { useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { scrollY } = useScroll();
  const categoriesY = useTransform(scrollY, [0, 400], [0, -20]);
  const trendingY = useTransform(scrollY, [200, 600], [0, -30]);
  useEffect(() => {
    if (storage.getRestaurants().length === 0) {
      storage.setRestaurants(mockRestaurants);
    }
  }, []);

  const trendingRestaurants = mockRestaurants.slice(0, 6);
  const navigate = useNavigate();

  return (
    <div>
      <Hero3D />
      
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ y: categoriesY as unknown as number }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </motion.div>
      </section>
      
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ y: trendingY as unknown as number }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Trending Restaurants
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button
              className="rounded-full px-6 py-2 gradient-primary text-white shadow-hover"
              onClick={() => navigate('/restaurants')}
            >
              More Restaurants
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;

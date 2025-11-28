import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MenuItemCard } from '@/components/MenuItemCard';
import { storage } from '@/lib/storage';
import { mockRestaurants, mockMenuItems } from '@/lib/mockData';
import { useEffect, useState } from 'react';

const RestaurantMenu = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(mockRestaurants.find(r => r.id === id));
  const [menuItems, setMenuItems] = useState(mockMenuItems.filter(item => item.restaurantId === id));

  useEffect(() => {
    // Initialize data
    if (storage.getRestaurants().length === 0) {
      storage.setRestaurants(mockRestaurants);
      storage.setMenuItems(mockMenuItems);
    }
    // Ensure we start at the top when opening a restaurant
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const itemId = searchParams.get('item');
    if (!itemId) return;
    const el = document.getElementById(itemId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-2', 'ring-primary');
      setTimeout(() => {
        el.classList.remove('ring-2', 'ring-primary');
      }, 1200);
    }
  }, [searchParams]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Restaurant not found</p>
      </div>
    );
  }

  const categories = [...new Set(menuItems.map(item => item.category))];

  return (
    <div className="min-h-screen pb-8">
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 glass-card"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <motion.div
          className="glass-card rounded-2xl p-6 shadow-hover mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {restaurant.name}
          </h1>
          <p className="text-muted-foreground mb-4">
            {restaurant.cuisine.join(', ')}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-primary font-semibold">
              <Star className="h-4 w-4 fill-current" />
              {restaurant.rating}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {restaurant.deliveryTime}
            </div>
            <div className="text-muted-foreground font-medium">
              {restaurant.priceRange}
            </div>
          </div>
        </motion.div>

        {categories.map((category, index) => (
          <motion.div
            key={category}
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">{category}</h2>
            <div className="grid gap-4">
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantMenu;

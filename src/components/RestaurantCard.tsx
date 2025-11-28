import { motion } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import { Restaurant } from '@/lib/storage';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="glass-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-smooth cursor-pointer group"
      whileHover={{ y: -5 }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-smooth duration-500"
        />
        {restaurant.isVeg && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            Veg
          </Badge>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-foreground mb-2">{restaurant.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {restaurant.cuisine.join(', ')}
        </p>
        
        <div className="flex items-center justify-between text-sm">
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
      </div>
    </motion.div>
  );
};

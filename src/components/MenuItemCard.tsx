import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { MenuItem, storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const MenuItemCard = ({ item }: { item: MenuItem }) => {
  const [quantity, setQuantity] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const cart = storage.getCart();
    const cartItem = cart.find(i => i.id === item.id);
    setQuantity(cartItem?.quantity || 0);
  }, [item.id]);

  const handleAdd = () => {
    storage.addToCart(item);
    setQuantity(quantity + 1);
    window.dispatchEvent(new Event('cart-updated'));
    toast({
      title: 'Added to cart',
      description: `${item.name} added to your cart`,
    });
  };

  const handleIncrement = () => {
    storage.updateCartItemQuantity(item.id, quantity + 1);
    setQuantity(quantity + 1);
    window.dispatchEvent(new Event('cart-updated'));
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      storage.updateCartItemQuantity(item.id, quantity - 1);
      setQuantity(quantity - 1);
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  return (
    <motion.div
      id={item.id}
      className="glass-card rounded-2xl p-4 shadow-card hover:shadow-hover transition-smooth"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={item.isVeg ? 'default' : 'destructive'} className="text-xs">
                  {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                </Badge>
              </div>
              <h3 className="font-bold text-foreground text-lg">{item.name}</h3>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">₹{item.price}</span>
            
            {quantity === 0 ? (
              <Button onClick={handleAdd} size="sm" className="rounded-full">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-primary rounded-full p-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  onClick={handleDecrement}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-primary-foreground font-bold min-w-[20px] text-center">
                  {quantity}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-full hover:bg-primary-foreground/20 text-primary-foreground"
                  onClick={handleIncrement}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* No item image as requested */}
      </div>
    </motion.div>
  );
};

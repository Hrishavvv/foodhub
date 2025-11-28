import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storage, CartItem } from '@/lib/storage';
import { Badge } from '@/components/ui/badge';

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCart(storage.getCart());
  }, []);

  const updateQuantity = (itemId: string, quantity: number) => {
    storage.updateCartItemQuantity(itemId, quantity);
    setCart(storage.getCart());
    window.dispatchEvent(new Event('cart-updated'));
  };

  const removeItem = (itemId: string) => {
    storage.updateCartItemQuantity(itemId, 0);
    setCart(storage.getCart());
    window.dispatchEvent(new Event('cart-updated'));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 40 : 0;
  const taxes = subtotal * 0.05;
  const total = subtotal + deliveryFee + taxes;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
          <Button onClick={() => navigate('/restaurants')}>Browse Restaurants</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-8">Your Cart</h1>

          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                className="glass-card rounded-2xl p-4 shadow-card"
                layout
              >
                <div className="flex gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-foreground">{item.name}</h3>
                        <Badge variant={item.isVeg ? 'default' : 'destructive'} className="text-xs mt-1">
                          {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-foreground">
                        ₹{item.price * item.quantity}
                      </span>
                      
                      <div className="flex items-center gap-2 bg-secondary rounded-full p-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-bold min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="glass-card rounded-2xl p-6 shadow-hover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-foreground mb-4">Bill Details</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes (5%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;

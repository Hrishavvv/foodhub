import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { storage } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    pin: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const cart = storage.getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 40;
  const taxes = subtotal * 0.05;
  const total = subtotal + deliveryFee + taxes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.street || !formData.pin) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    const order = storage.addOrder({
      items: cart,
      total,
      status: 'placed',
      address: formData,
      paymentMethod,
    });

    storage.clearCart();
    window.dispatchEvent(new Event('cart-updated'));
    
    toast({
      title: 'Order Placed!',
      description: 'Your food will be delivered soon',
    });

    navigate(`/order/${order.id}`);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="glass-card rounded-2xl p-6 shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-4">Delivery Address</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                    placeholder="+91 98765 43210"
                  />
                </div>
                
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="mt-1"
                    placeholder="123 Main Street, Apartment 4B"
                  />
                </div>
                
                <div>
                  <Label htmlFor="pin">PIN Code</Label>
                  <Input
                    id="pin"
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    className="mt-1"
                    placeholder="400001"
                  />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-card">
              <h2 className="text-xl font-bold text-foreground mb-4">Payment Method</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="cursor-pointer">UPI Payment</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer">Cash on Delivery</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-hover">
              <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
              
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

              <Button type="submit" className="w-full" size="lg">
                Place Order
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;

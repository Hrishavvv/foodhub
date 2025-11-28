import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Package, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';
import { useEffect, useState } from 'react';

const statusSteps = [
  { id: 'placed', label: 'Order Placed', icon: CheckCircle2 },
  { id: 'preparing', label: 'Preparing', icon: Clock },
  { id: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Package },
];

const OrderStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(storage.getOrder(id!));

  useEffect(() => {
    if (!order) return;

    // Simulate order status updates
    const statusSequence: Array<typeof order.status> = ['preparing', 'out-for-delivery', 'delivered'];
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < statusSequence.length) {
        storage.updateOrderStatus(id!, statusSequence[currentStep]);
        setOrder(storage.getOrder(id!));
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-4">Order not found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(step => step.id === order.status);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Order Status</h1>
          <p className="text-muted-foreground mb-8">Order #{order.id}</p>

          <div className="glass-card rounded-2xl p-8 shadow-hover mb-8">
            <div className="space-y-8">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isComplete = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <motion.div
                    key={step.id}
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-full transition-smooth ${
                        isComplete
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3
                        className={`font-bold transition-smooth ${
                          isComplete ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </h3>
                      {isCurrent && (
                        <motion.p
                          className="text-sm text-primary"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          In progress...
                        </motion.p>
                      )}
                    </div>
                    
                    {isComplete && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-card mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Delivery Address</h2>
            <p className="text-muted-foreground">
              {order.address.name}<br />
              {order.address.phone}<br />
              {order.address.street}<br />
              PIN: {order.address.pin}
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 shadow-card">
            <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-muted-foreground">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between text-xl font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-8"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderStatus;

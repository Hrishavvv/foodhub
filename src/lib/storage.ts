export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  deliveryTime: string;
  priceRange: string;
  image: string;
  isVeg: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'placed' | 'preparing' | 'out-for-delivery' | 'delivered';
  address: {
    name: string;
    phone: string;
    street: string;
    pin: string;
  };
  paymentMethod: string;
  createdAt: string;
}

class LocalStorage {
  private getItem<T>(key: string, defaultValue: T): T {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Restaurants
  getRestaurants(): Restaurant[] {
    return this.getItem('restaurants', []);
  }

  setRestaurants(restaurants: Restaurant[]): void {
    this.setItem('restaurants', restaurants);
  }

  // Menu Items
  getMenuItems(): MenuItem[] {
    return this.getItem('menuItems', []);
  }

  setMenuItems(items: MenuItem[]): void {
    this.setItem('menuItems', items);
  }

  getMenuItemsByRestaurant(restaurantId: string): MenuItem[] {
    return this.getMenuItems().filter(item => item.restaurantId === restaurantId);
  }

  // Cart
  getCart(): CartItem[] {
    return this.getItem('cart', []);
  }

  setCart(cart: CartItem[]): void {
    this.setItem('cart', cart);
  }

  addToCart(item: MenuItem): void {
    const cart = this.getCart();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    
    this.setCart(cart);
  }

  updateCartItemQuantity(itemId: string, quantity: number): void {
    const cart = this.getCart();
    const item = cart.find(cartItem => cartItem.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.setCart(cart.filter(cartItem => cartItem.id !== itemId));
      } else {
        item.quantity = quantity;
        this.setCart(cart);
      }
    }
  }

  clearCart(): void {
    this.setCart([]);
  }

  // Orders
  getOrders(): Order[] {
    return this.getItem('orders', []);
  }

  addOrder(order: Omit<Order, 'id' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    orders.push(newOrder);
    this.setItem('orders', orders);
    return newOrder;
  }

  updateOrderStatus(orderId: string, status: Order['status']): void {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.setItem('orders', orders);
    }
  }

  getOrder(orderId: string): Order | undefined {
    return this.getOrders().find(o => o.id === orderId);
  }
}

export const storage = new LocalStorage();

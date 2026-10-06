'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'In Transit' | 'Processing';
  trackingNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  addresses: UserAddress[];
  orders: Order[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (data: { name: string; email: string; avatar?: string; googleId?: string }) => void;
  loginWithPhone: (phone: string, name?: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'phone'>>) => void;
  addAddress: (address: Omit<UserAddress, 'id'>) => void;
  addOrder: (order: Order) => void;
}

const DEMO_USER: User = {
  id: 'usr_01',
  name: 'Pratikshit Sharma',
  email: 'pratikshit@sriraaj.in',
  phone: '+91 98765 43210',
  addresses: [
    {
      id: 'addr_01',
      label: 'Home',
      name: 'Pratikshit Sharma',
      phone: '+91 98765 43210',
      street: '42 Heritage Enclave, Civil Lines',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302006',
      isDefault: true,
    },
    {
      id: 'addr_02',
      label: 'Office',
      name: 'Pratikshit Sharma',
      phone: '+91 98765 43210',
      street: '12th Floor, Tower B, Cyber City',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      isDefault: false,
    },
  ],
  orders: [
    {
      id: 'SR-84920',
      date: '02 Oct 2026',
      status: 'In Transit',
      trackingNumber: 'BLRD849203IN',
      shippingAddress: '42 Heritage Enclave, Civil Lines, Jaipur 302006',
      items: [
        {
          id: 'item_1',
          name: 'A2 Cow Ghee (Bilona Method)',
          size: '1 Litre',
          price: 1299,
          quantity: 1,
          image: '/images/product-ghee.jpg',
        },
        {
          id: 'item_2',
          name: 'Cold-Pressed Mustard Oil',
          size: '1 Litre',
          price: 349,
          quantity: 2,
          image: '/images/product-mustard-oil.jpg',
        },
      ],
      subtotal: 1997,
      shipping: 0,
      total: 1997,
    },
    {
      id: 'SR-78210',
      date: '14 Sep 2026',
      status: 'Delivered',
      trackingNumber: 'DEL782109IN',
      shippingAddress: '42 Heritage Enclave, Civil Lines, Jaipur 302006',
      items: [
        {
          id: 'item_3',
          name: 'Cold-Pressed Groundnut Oil',
          size: '1 Litre',
          price: 389,
          quantity: 2,
          image: '/images/product-groundnut-oil.jpg',
        },
      ],
      subtotal: 778,
      shipping: 50,
      total: 828,
    },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sriraaj_auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // storage disabled
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUser = (u: User | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage disabled
    }
  };

  const login = async (email: string, _password?: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      return { success: false, error: 'Please enter your email address' };
    }

    // If it's the demo email or any login, populate or restore account
    if (trimmed === DEMO_USER.email.toLowerCase()) {
      saveUser(DEMO_USER);
      return { success: true };
    }

    // Create a personalized user account for the entered email
    const namePart = trimmed.split('@')[0];
    const capitalizedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: capitalizedName,
      email: trimmed,
      phone: '+91 98000 00000',
      addresses: [
        {
          id: `addr_${Date.now()}`,
          label: 'Default Address',
          name: capitalizedName,
          phone: '+91 98000 00000',
          street: '108 Rajpath Avenue',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          isDefault: true,
        },
      ],
      orders: [],
    };
    saveUser(newUser);
    return { success: true };
  };

  const register = async (name: string, email: string, phone: string, _password?: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    setIsLoading(false);

    if (!name.trim() || !email.trim()) {
      return { success: false, error: 'Please provide both your name and email' };
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || '+91 90000 00000',
      addresses: [],
      orders: [],
    };
    saveUser(newUser);
    return { success: true };
  };

  const loginWithGoogle = (data: { name: string; email: string; avatar?: string; googleId?: string }) => {
    const existing = user && user.email === data.email ? user : null;
    const googleUser: User = {
      id: existing?.id || data.googleId || `usr_g_${Date.now()}`,
      name: data.name || 'Google Customer',
      email: data.email,
      phone: existing?.phone || '+91 98765 43210',
      avatar: data.avatar,
      addresses: existing?.addresses || [],
      orders: existing?.orders || [],
    };
    saveUser(googleUser);
  };

  const loginWithPhone = (phone: string, name?: string) => {
    const existing = user && user.phone === phone ? user : null;
    const phoneUser: User = {
      id: existing?.id || `usr_p_${Date.now()}`,
      name: name || existing?.name || 'Valued Patron',
      email: existing?.email || `patron_${phone.slice(-4)}@sriraaj.in`,
      phone: phone.startsWith('+') ? phone : `+91 ${phone}`,
      addresses: existing?.addresses || [],
      orders: existing?.orders || [],
    };
    saveUser(phoneUser);
  };

  const logout = () => {
    saveUser(null);
  };

  const updateProfile = (data: Partial<Pick<User, 'name' | 'phone'>>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    saveUser(updated);
  };

  const addAddress = (address: Omit<UserAddress, 'id'>) => {
    if (!user) return;
    const newAddr: UserAddress = {
      ...address,
      id: `addr_${Date.now()}`,
      isDefault: Boolean(address.isDefault),
    };
    const updatedAddresses: UserAddress[] = address.isDefault
      ? [...user.addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
      : [...user.addresses, newAddr];

    saveUser({ ...user, addresses: updatedAddresses });
  };

  const addOrder = (order: Order) => {
    if (!user) return;
    saveUser({ ...user, orders: [order, ...user.orders] });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        loginWithPhone,
        logout,
        updateProfile,
        addAddress,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

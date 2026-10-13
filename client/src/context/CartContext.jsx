import { createContext, useContext, useEffect, useState } from "react";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cart.service";

import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const EMPTY_CART = {
  cartId: null,
  items: [],
  total: 0,
};

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart(EMPTY_CART);
      return;
    }

    try {
      setLoading(true);

      const data = await getCart();

      const cartData = data.cart || data;

      setCart({
        cartId: cartData.cartId ?? null,
        items: cartData.items ?? [],
        total: Number(cartData.total ?? 0),
      });
    } catch (error) {
      console.error("Failed to load cart:", error);
      setCart(EMPTY_CART);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchCart();
    }
  }, [user, authLoading]);

  const addItem = async (productId, quantity = 1) => {
    const data = await addToCart(productId, quantity);

    await fetchCart();

    return data;
  };

  const updateItem = async (itemId, quantity) => {
    const data = await updateCartItem(itemId, quantity);

    await fetchCart();

    return data;
  };

  const removeItem = async (itemId) => {
    const data = await removeCartItem(itemId);

    await fetchCart();

    return data;
  };

  const emptyCart = async () => {
    const data = await clearCart();

    await fetchCart();

    return data;
  };

  const itemCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
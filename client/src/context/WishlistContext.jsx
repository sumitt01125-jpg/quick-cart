import { createContext, useContext, useEffect, useState } from "react";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../services/wishlist.service";

import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getWishlist();

      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error("Failed to load wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchWishlist();
    }
  }, [user, authLoading]);

  const addItem = async (productId) => {
    const data = await addToWishlist(productId);

    await fetchWishlist();

    return data;
  };

  const removeItem = async (productId) => {
    const data = await removeFromWishlist(productId);

    await fetchWishlist();

    return data;
  };

  const isWishlisted = (productId) => {
    return wishlist.some(
      (item) => item.product?.id === productId
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        fetchWishlist,
        addItem,
        removeItem,
        isWishlisted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
import { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./auth";
import toast from "react-hot-toast";
import api from "../axios/api";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [auth] = useAuth();
  const [cart, setCart] = useState({ items: [], updatedAt: "" });

  const handleCart = async (userId, productId) => {
    try {
      const { data } = await api.post(`/api/v1/cart/add-cartitem`, {
        userId,
        productId,
      });

      if (data?.success) {
        const updatedCart = data?.cart?.items || [];
        setCart({
          items: updatedCart,
          updatedAt: new Date().toISOString(),
        });
        toast.success(data?.message);
      } else {
        toast.error(data?.message || "Unexpected response from server");
      }
    } catch (error) {
      console.error("Error adding cart item:", error);
      if (error.response) {
        if (error.response.status === 400) {
          const { message } = error.response.data;
          toast.error(message);
        } else {
          toast.error(`An error occurred: ${error.response.statusText}`);
        }
      } else {
        toast.error("An error occurred");
      }
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get(
          `/api/v1/cart/get-cart/${auth?.user?._id}`
        );
        if (data?.success) {
          setCart(data?.cart || { items: [], updatedAt: "" });
        } else {
          toast.error(
            "Failed to fetch cart: " + (data?.message || "Unknown error")
          );
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("Failed to fetch cart");
      }
    };

    if (auth?.user?._id) fetchCart();
  }, [auth?.user?._id]);

  return (
    <CartContext.Provider value={{ cart, setCart, handleCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };

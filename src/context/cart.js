import { useState, useContext, createContext, useEffect } from "react";
import { useAuth } from "./auth";
import toast from "react-hot-toast";
import api from "../axios/api";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [auth, setAuth] = useAuth();
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
        toast.success(data?.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          const { message } = error.response.data;
          toast.error(message);
        } else {
          toast.error("An error occurred");
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
          return;
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch cart");
      }
    };
    if (auth?.token) fetchCart();
  }, [auth?.user?._id, auth?.token]);

  return (
    <CartContext.Provider value={{ cart, setCart, handleCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };

import { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./auth";
import toast from "react-hot-toast";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useState([]);
  const handleCart = async (userId, productId) => {
    try {
      const { data } = await axios.post(
        `/api/v1/cart/add-cartitem`,
        { userId, productId }
      );

      if (data?.success) {
        if (data?.cart) {
          const updatedCart = data?.cart?.items.map((item) => {
            if (item.productId._id === productId) {
              return {
                ...item,
              };
            }
            return item;
          });
          setCart({
            ...cart,
            items: updatedCart,
            updatedAt: new Date().toISOString(),
          });
          if (data?.success) toast.success(data?.message);
        } else {
          toast.success(data?.message);
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          const { message } = error.response.data;
          toast.success(message);
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
        const { data } = await axios.get(
          `/api/v1/cart/get-cart/${auth?.user?._id}`
        );
        if (data?.success) {
          setCart(data?.cart);
        } else {
          console.log(data?.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };
    if (auth?.token) fetchCart();
  }, [auth?.user?._id]);

  return (
    <CartContext.Provider value={{ cart, setCart, handleCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => useContext(CartContext);

export { useCart, CartProvider };


import { createSlice } from "@reduxjs/toolkit";

const getCartFromStorage = () => {
  try {
    const cart = localStorage.getItem("soleora-cart");
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem("soleora-cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Cart storage error:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: getCartFromStorage(),
  },

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;

      if (!productId) return;

      const existingItem = state.items.find(
        (item) => item._id === productId
      );

      const stock = Number(product.stock ?? 0);

      if (stock <= 0) return;

      if (existingItem) {
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({
          ...product,
          _id: productId,
          quantity: 1,
          stock,
        });
      }

      saveCartToStorage(state.items);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item._id === action.payload
      );

      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }

      saveCartToStorage(state.items);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item._id === action.payload
      );

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload
      );

      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => {
    const price = Number(
      item.specialPrice ?? item.discountPrice ?? item.originalPrice ?? item.price ?? 0
    );

    return total + price * item.quantity;
  }, 0);

export default cartSlice.reducer;

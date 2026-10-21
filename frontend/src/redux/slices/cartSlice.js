
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

const getProductId = (item) => String(item?._id ?? item?.id ?? "");

const getReservations = (item) => {
  if (Array.isArray(item?.reservations) && item.reservations.length > 0) {
    return item.reservations.filter(
      (reservation) => reservation?.reservationId
    );
  }

  // Support older cart items containing only one reservationId.
  if (item?.reservationId) {
    return [
      {
        reservationId: item.reservationId,
        quantity: Number(item.quantity || 1),
      },
    ];
  }

  return [];
};

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: getCartFromStorage(),
  },

  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;
      const product = payload.product || payload;
      const productId = getProductId(product);

      if (!productId) return;

      const quantityToAdd = Math.max(
        1,
        Number(payload.quantity || 1)
      );

      const isReserved = Boolean(payload.reservationId);
      const stock = Math.max(0, Number(product.stock ?? 0));

      const existingItem = state.items.find(
        (item) => getProductId(item) === productId
      );

      if (!isReserved && stock <= 0) return;

      if (existingItem) {
        existingItem.quantity =
          Number(existingItem.quantity || 0) + quantityToAdd;

        existingItem.stock = stock;

        if (!Array.isArray(existingItem.reservations)) {
          existingItem.reservations = getReservations(existingItem);
        }

        if (isReserved) {
          existingItem.reservations.push({
            reservationId: payload.reservationId,
            quantity: quantityToAdd,
          });
        }

        // Keep the first reservationId for compatibility.
        if (!existingItem.reservationId && payload.reservationId) {
          existingItem.reservationId = payload.reservationId;
        }
      } else {
        state.items.push({
          ...product,
          _id: productId,
          quantity: quantityToAdd,
          stock,
          reservations: isReserved
            ? [
                {
                  reservationId: payload.reservationId,
                  quantity: quantityToAdd,
                },
              ]
            : [],
          reservationId: payload.reservationId || null,
        });
      }

      saveCartToStorage(state.items);
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => getProductId(item) === String(action.payload)
      );

      if (item && Number(item.quantity) < Number(item.stock)) {
        item.quantity += 1;
      }

      saveCartToStorage(state.items);
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (item) => getProductId(item) === String(action.payload)
      );

      if (item && Number(item.quantity) > 1) {
        item.quantity -= 1;
      }

      saveCartToStorage(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => getProductId(item) !== String(action.payload)
      );

      saveCartToStorage(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },

    removeReservation: (state, action) => {
      const { productId, reservationId, quantity } = action.payload;

      const item = state.items.find(
        (item) => getProductId(item) === String(productId)
      );

      if (!item) return;

      const reservations = getReservations(item);
      const reservation = reservations.find(
        (entry) => entry.reservationId === reservationId
      );

      if (reservation) {
        const quantityToRemove = Math.max(
          1,
          Number(quantity || reservation.quantity)
        );

        reservation.quantity -= quantityToRemove;

        item.reservations = reservations.filter(
          (entry) => entry.quantity > 0
        );

        item.reservationId =
          item.reservations[0]?.reservationId || null;
      }

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
  removeReservation,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = (state) =>
  state.cart.items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => {
    const price = Number(
      item.specialPrice ??
        item.discountPrice ??
        item.price ??
        item.originalPrice ??
        0
    );

    return total + price * Number(item.quantity || 0);
  }, 0);

export default cartSlice.reducer;

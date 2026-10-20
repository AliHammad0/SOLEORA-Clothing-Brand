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

    if (isReserved) {
      existingItem.reservations = [
        ...(existingItem.reservations || []),
        {
          reservationId: payload.reservationId,
          quantity: quantityToAdd,
        },
      ];
    }

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

    // Use after a backend reservation has been successfully released.
    removeReservation: (state, action) => {
      const { productId, reservationId, quantity } = action.payload;

      const item = state.items.find(
        (item) => getProductId(item) === String(productId)
      );

      if (!item) return;

      const reservations = item.reservations || [];
      const reservation = reservations.find(
        (entry) => entry.reservationId === reservationId
      );

      if (reservation) {
        reservation.quantity -= Number(quantity || reservation.quantity);

        if (reservation.quantity <= 0) {
          item.reservations = reservations.filter(
            (entry) => entry.reservationId !== reservationId
          );
        }
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
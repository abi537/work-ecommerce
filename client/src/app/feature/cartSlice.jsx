import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartOpen: false,
  cart: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
    
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
  const newItem = { ...action.payload.item };
  console.log("New item added to cart:", newItem);

  // size already exists on newItem
  const isItemExist = state.cart.find(
    (i) => i._id === newItem._id && i.size === newItem.size
  );

  const cartItems = isItemExist
    ? state.cart.map((i) =>
        i._id === isItemExist._id && i.size === isItemExist.size
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    : [...state.cart, newItem];

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  state.cart = cartItems;
}
,

    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(
        (item) =>
          !(item._id === action.payload.id && item.size === action.payload.size)
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    increaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (item._id === action.payload.id && item.size === action.payload.size) {
          item.quantity++;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },

    decreaseCount: (state, action) => {
      state.cart = state.cart.map((item) => {
        if (
          item._id === action.payload.id &&
          item.size === action.payload.size &&
          item.quantity > 1
        ) {
          item.quantity--;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.cart));
    },
    updateCartItemSize: (state, action) => {
  const { id, size } = action.payload;
  const existingItem = state.cart.find((item) => item._id === id);
  if (existingItem) {
    existingItem.size = size;
  }
},


    setIsCartOpen: (state) => {
      state.isCartOpen = !state.isCartOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseCount,
  decreaseCount,
  updateCartItemSize,
  setIsCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
//OG
// export const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {

//     addToCart: (state, action) => {
//       const newItem = { ...action.payload.item };

//       const isItemExist = state.cart.find((i) => i._id === newItem._id);
//       const cartItems = isItemExist
//         ? state.cart.map((i) => (i._id === isItemExist._id ? newItem : i))
//         : [...state.cart, newItem]
//       localStorage.setItem('cartItems', JSON.stringify(cartItems));
//       state.cart = cartItems;
//     },
//     removeFromCart: (state, action) => {
//       state.cart = state.cart.filter((item) => item._id !== action.payload.id);
//       localStorage.setItem('cartItems', JSON.stringify(state.cart));
//     },

//     increaseCount: (state, action) => {
//       state.cart = state.cart.map((item) => {
//         if (item._id === action.payload.id) {
//           item.quantity++;
//         }
//         return item;
//       });
//       localStorage.setItem('cartItems', JSON.stringify(state.cart));
//     },

//     decreaseCount: (state, action) => {
//       state.cart = state.cart.map((item) => {
//         if (item._id === action.payload.id && item.quantity > 1) {
//           item.quantity--;
//         }
//         return item;
//       });
//       localStorage.setItem('cartItems', JSON.stringify(state.cart));
//     },
//     setIsCartOpen: (state) => {
//       state.isCartOpen = !state.isCartOpen;
//     },
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   increaseCount,
//   decreaseCount,
//   setIsCartOpen,
// } = cartSlice.actions;

// export default cartSlice.reducer;

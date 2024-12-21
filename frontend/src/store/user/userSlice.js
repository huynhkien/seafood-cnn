import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncActions';

const initialCart = JSON.parse(localStorage.getItem('cart')) || [];
const initialWaveHouse = JSON.parse(localStorage.getItem('receipt')) || [];
const initialVoucher = JSON.parse(localStorage.getItem('voucher')) || [];
const initialProduct = JSON.parse(localStorage.getItem('product')) || [];
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLogin: false,
    current: null,
    token: null,
    isLoading: false,
    mes: '',
    currentCart: initialCart,
    waveHouse: initialWaveHouse,
    voucher: initialVoucher,
    product: initialProduct,
  },
  reducers: {
    login: (state, action) => {
      const { isLogin, token, userData } = action.payload;
      state.isLogin = isLogin;
      state.token = token;
      state.current = userData;
    },
    logout: (state) => {
      state.isLogin = false
      state.current = null
      state.token = null
      state.isLoading = false
      state.mes = ''
    },
    clearMessage: (state) => {
      state.mes = '';
    },
    addProduct: (state, action) => {
      const existingItemIndex = state.voucher.findIndex(
        (item) =>
          item.product === action.payload.product
      );
      
      if (existingItemIndex !== -1) {
        alert('Sản phẩm với biến thể này đã tồn tại trong danh sách voucher!');
      } else {
        state.product.push(action.payload);
        localStorage.setItem('product', JSON.stringify(state.product));
      }
    },
    
    addVoucherProduct: (state, action) => {
      const existingItemIndex = state.voucher.findIndex(
        (item) =>
          item.product === action.payload.product
      );
      
      if (existingItemIndex !== -1) {
        alert('Sản phẩm với biến thể này đã tồn tại trong danh sách voucher!');
      } else {
        state.voucher.push(action.payload);
        localStorage.setItem('voucher', JSON.stringify(state.voucher));
      }
    },
    addVoucherCategory: (state, action) => {
      const existingItemIndex = state.voucher.findIndex(
        (item) =>
          item.category === action.payload.category
      );
      
      if (existingItemIndex !== -1) {
        alert('Danh mục này đã tồn tại trong danh sách voucher!');
      } else {
        state.voucher.push(action.payload);
        localStorage.setItem('voucher', JSON.stringify(state.voucher));
      }
    },
    addVoucherUser: (state, action) => {
      const existingItemIndex = state.voucher.findIndex(
        (item) =>
          item.name === action.payload.name
      );
      
      if (existingItemIndex !== -1) {
        alert('Danh mục này đã tồn tại trong danh sách voucher!');
      } else {
        state.voucher.push(action.payload);
        localStorage.setItem('voucher', JSON.stringify(state.voucher));
      }
    },
    removeVoucherCategory: (state, action) => {
      const { id } = action.payload;
      state.voucher = state.voucher.filter(item => 
        item.id !== id 
      );
      localStorage.setItem('voucher', JSON.stringify(state.voucher));
    },
    removeVoucherUser: (state, action) => {
      const { name } = action.payload;
      state.voucher = state.voucher.filter(item => 
        item.name !== name 
      );
      localStorage.setItem('voucher', JSON.stringify(state.voucher));
    },
    removeVoucher: (state, action) => {
      const { product } = action.payload;
      state.voucher = state.voucher.filter(item => 
        item.product !== product 
      );
      localStorage.setItem('voucher', JSON.stringify(state.voucher));
    },
    removeAllVoucher: (state) => {
      state.voucher = []; 
      localStorage.removeItem('voucher');
    },    
    addWaveHouse: (state, action) => {
      const existingItemIndex = state.waveHouse.findIndex(
        (item) =>
          item.product === action.payload.product &&
          item.variant === action.payload.variant &&
          item.supplier === action.payload.supplier
      );
      if (existingItemIndex !== -1) {
        state.waveHouse[existingItemIndex].quantity += action.payload.quantity;
        state.waveHouse[existingItemIndex].totalPrice += action.payload.totalPrice;
      } else {
        state.waveHouse.push(action.payload);
      }
    
      localStorage.setItem('receipt', JSON.stringify(state.waveHouse));
    },
    
    removeWaveHouse: (state, action) => {
      const { productId, variant, name } = action.payload;
      state.waveHouse = state.waveHouse.filter(item => 
        item.product !== productId || item.variant !== variant || item.name !== name 
      );
      localStorage.setItem('receipt', JSON.stringify(state.waveHouse));
    },
    removeAllWaveHouse: (state) => {
      state.waveHouse = []; 
      localStorage.removeItem('receipt');
    },
    
    
    addToWishList: (state, action) => {
      if (!state.current.wishlist.includes(action.payload)) {
        state.current.wishlist.push(action.payload);
      }
    },
    removeFromWishList: (state, action) => {
      state.current.wishlist = state.current.wishlist.filter(id => id !== action.payload);
    },
    addToCart: (state, action) => {
      const { pid, variant, quantity, thumb, name, price, category } = action.payload;
      const existingProductIndex = state.currentCart.findIndex(
        item => item.product === pid && item.variant === variant
      );
      if (existingProductIndex !== -1) {
        state.currentCart[existingProductIndex].quantity += quantity;
      } else {
        state.currentCart.push({
          product: pid,
          thumb,
          name,
          category,
          price,
          variant,
          quantity,
        });
      }
      localStorage.setItem('cart', JSON.stringify(state.currentCart));
    },
    addMultipleToCart: (state, action) => {
      const productsToAdd = action.payload;
    
      // Kiểm tra xem productsToAdd có phải là mảng không
      if (Array.isArray(productsToAdd)) {
        productsToAdd.forEach(({ pid, variant, quantity, thumb, name, price, category }) => {
          const existingProductIndex = state.currentCart.findIndex(
            item => item.product === pid && item.variant === variant
          );
          if (existingProductIndex !== -1) {
            state.currentCart[existingProductIndex].quantity += quantity;
          } else {
            state.currentCart.push({
              product: pid,
              thumb,
              name,
              category,
              price,
              variant,
              quantity,
            });
          }
        });
        localStorage.setItem('cart', JSON.stringify(state.currentCart));
      } else {
        console.error('productsToAdd is not an array:', productsToAdd);
      }
    },
    
    
    removeCart: (state, action) => {
      const { pid, variant } = action.payload;
      state.currentCart = state.currentCart.map(item => {
        if (item.variant === variant && item.product?._id === pid) {
          if (item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return null;
        }
        return item;
      }).filter(item => item !== null);  
      localStorage.setItem('cart', JSON.stringify(state.currentCart));
    },
    removeProductCart: (state, action) => {
      const { pid, variant } = action.payload;
      state.currentCart = state.currentCart.filter(
        item => !(item.product?._id === pid && item.variant === variant)
      );
      localStorage.setItem('cart', JSON.stringify(state.currentCart));
    },
    removeAllCart: (state, action) => {
      state.currentCart = []; 
      localStorage.removeItem('cart');
    },
    
    updateCart: (state, action) => {
      const { pid, variant, quantity } = action.payload;
      state.currentCart = state.currentCart.map(item => {
        if (item.variant === variant && item.product?._id === pid) {
          return { ...item, quantity };
        }
        return item;
      });
    
      localStorage.setItem('cart', JSON.stringify(state.currentCart));
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(actions.getCurrent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(actions.getCurrent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload;
        state.isLogin = true;
      })
      .addCase(actions.getCurrent.rejected, (state) => {
        state.isLoading = false;
        state.current = null;
        state.isLogin = false;
        state.token = null;
        state.mes = 'Phiên đăng nhập đã hết hạn, hãy đăng nhập lại';
      });
  }
});

export const { addProduct, login, logout, clearMessage, addToCart, updateCart, removeCart, removeProductCart, removeAllCart, addMultipleToCart, addToWishList, removeFromWishList, addWaveHouse, removeWaveHouse, removeAllWaveHouse, addVoucherProduct, removeVoucher, removeAllVoucher, removeVoucherCategory, addVoucherCategory, addVoucherUser , removeVoucherUser} = userSlice.actions;
export default userSlice.reducer;

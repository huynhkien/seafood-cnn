import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    isLoading: false,
    isShowModal: false,
    modalType: null,
    isShowCart: false,
  },
  reducers: {
   
    showModal: (state, action) => {
      state.isShowModal = action.payload.isShowModal
      state.modalType = action.payload.modalType
    },
    hideModal: (state) => {
      state.isShowModal = false;
      state.modalType = null;
    },
    showCart: (state) => {
      state.isShowCart = state.isShowCart === false ? true : false
    }
  },
});
export const {showModal, showCart} = appSlice.actions;
export default appSlice.reducer;

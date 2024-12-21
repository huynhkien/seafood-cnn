import { configureStore } from '@reduxjs/toolkit';
import appSlice from './app/appSlice';
import storage from 'redux-persist/lib/storage';
import  userSlice  from './user/userSlice';
import { persistReducer, persistStore } from 'redux-persist';
import {

  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
const commonConfig = {
  key: 'shop/user',
  storage
}
const userConfig = {
  ...commonConfig,
  whitelist: ['isLogin', 'token', 'current']
}

export const store = configureStore({
  reducer: {
    app: appSlice,
    user: persistReducer(userConfig, userSlice)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

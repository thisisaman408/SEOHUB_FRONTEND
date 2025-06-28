import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slice/adminSlice';
import authReducer from './slice/authSlice';
import commentsReducer from './slice/commentsSlice';
import mediaReducer from './slice/mediaSlice';
import toolsReducer from './slice/toolsSlice';
import uiReducer from './slice/uiSlice';

export const store = configureStore({
  reducer: {
    tools: toolsReducer,
    auth: authReducer,
    comments: commentsReducer,
    media: mediaReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

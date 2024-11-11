// redux/actions/authActions.js
import authService from '../../services/authService';
import { loginStart, loginSuccess, loginFailure, logout } from '../slices/authSlice';

// Assuming authActions.js is using Redux Thunk
export const loginUser = (credentials) => async (dispatch) => {
  try {
      dispatch(loginStart());
      const { token, user } = await authService.login(credentials);
      dispatch(loginSuccess({ token, user }));
  } catch (error) {
      console.error("Login Action Error:", error);
      dispatch(loginFailure("Login failed"));
  }
};


export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const data = await authService.register(userData);
    dispatch(loginSuccess(data));
    return data;
  } catch (error) {
    dispatch(loginFailure(error.message));
    throw error;
  }
};

export const logoutUser = () => (dispatch) => {
  authService.logout();
  dispatch(logout());
};
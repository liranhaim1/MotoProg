import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/users";
import rateReducer from "./features/rating";
import { setUser, updateUser } from "./features/users";
import rating, { addRating, getRating, updateRating } from "./features/rating";

export const mapStateToProps = (state) => {
  return {
    user: state.users,
    rate: state.rates,
  };
};

export const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: (data) => dispatch(updateUser(data)),
    getUser: (data) => dispatch(setUser(data)),
    getRating: (id) => dispatch(getRating(id)),
    addRating: (data) => dispatch(addRating(data)),
    updateRating: (data) => dispatch(updateRating(data)),
  };
};

export const Store = configureStore({
  reducer: {
    users: userReducer,
    rates: rateReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

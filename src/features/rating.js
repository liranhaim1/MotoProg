import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getDoc,
  setDoc,
  doc,
  updateDoc,
  getDocs,
  collection,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";

export const getRating = createAsyncThunk(
  "appQuestions/getRating",
  async (questionId) => {
    const snap = await getDoc(doc(firestore, "ratings", questionId)); //questionId)) // TODO: change to questionId
    // console.log("getRating => ", snap.data())
    // localStorage.setItem("user", JSON.stringify({id:id, ...snap.data()}))
    return snap.data() === undefined
      ? {
          questionId: questionId,
          userRate: [],
          ratesCount: 0,
          ratesSum: 0,
        }
      : snap.data();
  }
);

export const addRating = createAsyncThunk(
  "appQuestions/createRating",
  async (data) => {
    await setDoc(doc(firestore, "ratings", data.questionId), {
      questionId: data.questionId,
      userRate: data.userRate,
      ratesCount: data.ratesCount,
      ratesSum: data.ratesSum,
    });
    return {
      questionId: data.questionId,
      userRate: data.userRate,
      ratesCount: data.ratesCount,
      ratesSum: data.ratesSum,
    };
  }
);

export const updateRating = createAsyncThunk(
  "appQuestions/updateRating",
  async (data, { dispatch }) => {
    await updateDoc(doc(firestore, "ratings", data.questionId), {
      userRate: data.userRate,
      ratesCount: data.ratesCount,
      ratesSum: data.ratesSum,
    });
    dispatch(getRating(data.id));
  }
);

export const Slice = createSlice({
  name: "Ratings",
  initialState: {
    questionId: "",
    userRate: [],
    ratesCount: 0,
    ratesSum: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRating.fulfilled, (state, action) => {
        state.questionId = action.payload.questionId;
        state.userRate = action.payload.userRate;
        state.ratesCount = action.payload.ratesCount;
        state.ratesSum = action.payload.ratesSum;
      })
      .addCase(getRating.fulfilled, (state, action) => {
        state.questionId = action.payload.questionId;
        state.userRate = action.payload.userRate;
        state.ratesCount = action.payload.ratesCount;
        state.ratesSum = action.payload.ratesSum;
      });
  },
});

export default Slice.reducer;

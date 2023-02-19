import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDoc, setDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

export const getUser = createAsyncThunk("appUsers/getUser", async (id) => {
    const snap = await getDoc(doc(firestore, 'users', id))
    localStorage.setItem("user", JSON.stringify({id:id, ...snap.data()}))
    return {
        id: id,
        ...snap.data()
    }
})

export const setUser = createAsyncThunk("appUsers/setUser", async (data) => {
    return {
        id: data.id,
        email: data.email,
        ids: data.ids,
        questionsHistory: data.questionsHistory,
    }
})

export const addUser = createAsyncThunk("appUsers/createUser", async (data, {dispatch}) => {
    await setDoc(doc(firestore, 'users', data.uid), {
        email: data.email,
        ids: [],
        questionsHistory: {},
    });
    return {
        id: data.uid,
        email: data.email,
        ids: [],
        questionsHistory: {},
    }
})

export const updateUser = createAsyncThunk("appUsers/updateUser", async (data, {dispatch}) => {
    console.log("data.ids => ", data.ids)
    await updateDoc(doc(firestore, 'users', data.id), {
        ids: data.ids,
        questionsHistory: data.questionsHistory,
    })
    dispatch(getUser(data.id))
})

export const Slice = createSlice({
    name: "Users",
    initialState: {
        id: "",
        email: "",
        ids: [],
        questionsHistory: {},
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getUser.fulfilled, (state, action) => {
                state.id = action.payload.id
                state.email = action.payload.email
                state.ids = action.payload.ids
                state.questionsHistory = action.payload.questionsHistory
            })
            .addCase(setUser.fulfilled, (state, action) => {
                state.id = action.payload.id
                state.email = action.payload.email
                state.ids = action.payload.ids
                state.questionsHistory = action.payload.questionsHistory
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.id = action.payload.id
                state.email = action.payload.email
                state.ids = action.payload.ids
                state.questionsHistory = action.payload.questionsHistory
            })
    }
})

export default Slice.reducer;
import {
  getDoc,
  setDoc,
  doc,
  updateDoc,
  addDoc,
  orderBy,
  query,
  where,
  getDocs,
  collection,
  CollectionReference,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "../firebase";

export const getHistory = async (userId) => {
  try {
    // Create a query to retrieve the history records for the specified user
    const q = query(
      collection(firestore, "history"),
      where("userId", "==", userId)
    );

    // Execute the query and get a snapshot of the results
    const querySnapshot = await getDocs(q);

    // Extract the data from each history record and return as an array
    const history = querySnapshot.docs.map((doc) => doc.data());

    return history;
  } catch (error) {
    console.error("Error getting history:", error);
  }
};

export const addHistory = async (
  userId,
  date,
  category,
  score,
  correctCount,
  wrongCount,
  userRate,
  globalRate,
  hints50Count,
  hintsCount
) => {
  const data = {
    userId,
    date,
    category,
    score,
    correctCount,
    wrongCount,
    userRate,
    globalRate,
    hints50Count,
    hintsCount,
  };

  await addDoc(collection(firestore, "history"), data);
};

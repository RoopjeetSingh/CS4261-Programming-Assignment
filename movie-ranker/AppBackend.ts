import { db } from "./config/firebase";
import { doc, setDoc, increment } from "firebase/firestore";
import { getTMDBImage } from "./tmdb";

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  points: number;
}

export const voteForMovie = async (
  movieId: number,
  title: string,
  posterUrl: string,
  pointsToAdd: number,
) => {
  const movieRef = doc(db, "movies", String(movieId));
  await setDoc(
    movieRef,
    { points: increment(pointsToAdd), title: title, posterUrl: posterUrl },
    { merge: true },
  );
};

import React, { useEffect, useState } from "react";
import { Movie } from "../../AppBackend";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { getTMDBImage } from "../../tmdb";

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => {
    const q = query(collection(db, "movies"), orderBy("points", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const movies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Movie[];
      setMovies(movies);
    });
    return () => unsubscribe();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Movie List Leaderboard</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Image
              source={{ uri: getTMDBImage(item.posterUrl) }}
              style={styles.thumbnail}
            />
            <View style={styles.info}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.points}>{item.points}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1a1a1a",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rank: { fontSize: 18, fontWeight: "bold", width: 36, color: "#007AFF" },
  thumbnail: { width: 45, height: 65, borderRadius: 6, marginRight: 12 },
  info: { flex: 1 },
  movieTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  points: { fontSize: 14, color: "#666", marginTop: 2 },
});

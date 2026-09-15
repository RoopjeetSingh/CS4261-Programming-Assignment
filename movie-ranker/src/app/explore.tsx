import React, { useEffect, useState } from "react";
import { Movie } from "../../AppBackend";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";
import { View, Text, FlatList, Image, StyleSheet, RefreshControl, Pressable } from "react-native";
import { getTMDBImage } from "../../tmdb";

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    const q = query(collection(db, "movies"), orderBy("points", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const movies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Movie[];
      setMovies(movies);
      setRefreshing(false); 
    });
    return () => unsubscribe();
  }, []);
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getRankStyle = (index: number) => {
    if (index === 0) return styles.rankGold;
    if (index === 1) return styles.rankSilver;
    if (index === 2) return styles.rankBronze;
    return styles.rankNeutral;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Movie List Leaderboard</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        refreshControl = {<RefreshControl refreshing = {refreshing} onRefresh = {onRefresh} colors = {["#007AFF"]} />}
        ListEmptyComponent = {
          <View style = {styles.emptyContainer}>
            <Text style = {styles.emptyText}>No movies found.</Text>
            <Text style = {styles.emptySubtext}>Try searching for something else.</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Pressable style = {({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <Text style = {[styles.rank, getRankStyle(index)]}>{index + 1}</Text>
            <Image
              source={{ uri: getTMDBImage(item.posterUrl) }}
              style={styles.thumbnail}
            />
            <View style={styles.info}>
              <Text style={styles.movieTitle}>{item.title}</Text>
              <Text style={styles.points}>{item.points} pts</Text>
            </View>
          </Pressable>
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
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  rowPressed: {
    backgroundColor: "#f3f8ff",
  },
  rank: { fontSize: 18, fontWeight: "bold", width: 36, textAlign: "center" },
  rankGold: { color: "#D4AF37" },
  rankSilver: { color: "#B0B0B0" },
  rankBronze: { color: "#C58A3A" },
  rankNeutral: { color: "#4a4a4a" },
  thumbnail: { width: 45, height: 65, borderRadius: 6, marginRight: 12 },
  info: { flex: 1 },
  movieTitle: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
  points: { fontSize: 14, color: "#666", marginTop: 2 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40 },
  emptyText: { fontSize: 16, fontWeight: "bold", color: "#666", marginBottom: 6 },
  emptySubtext: { fontSize: 14, color: "#999", textAlign: "center", paddingHorizontal: 20 },
});

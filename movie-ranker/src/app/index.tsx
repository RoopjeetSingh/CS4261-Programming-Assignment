import React, { useEffect, useState } from "react";
import { voteForMovie } from "../../AppBackend";
import { getMoviesFromTMDB, getTMDBImage, TMDBMovie } from "../../tmdb";
import {
  ActivityIndicator,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
} from "react-native";

export default function Rank() {
  const [movieList, setMovieList] = useState<TMDBMovie[]>([]);
  const [movie1, setMovie1] = useState<TMDBMovie | null>(null);
  const [movie2, setMovie2] = useState<TMDBMovie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      const movies = await getMoviesFromTMDB();
      setMovieList(movies);
      let [movie1, movie2] = getRandomPair(movies);
      setMovie1(movie1);
      setMovie2(movie2);
      setLoading(false);
    };
    getMovies();
  }, []);

  const getRandomMovie = (movies: TMDBMovie[]) => {
    return movies[Math.floor(Math.random() * movies.length)];
  };
  const getRandomPair = (movies: TMDBMovie[]) => {
    let movie1 = getRandomMovie(movies);
    let movie2 = getRandomMovie(movies);
    while (movie1.id === movie2.id) {
      movie2 = getRandomMovie(movies);
    }
    return [movie1, movie2];
  };

  const vote = async (
    winnerId: number | undefined,
    loserId: number | undefined,
  ) => {
    if (!winnerId || !loserId) {
      return;
    }
    let winner = movieList.find((movie) => movie.id === winnerId);
    let loser = movieList.find((movie) => movie.id === loserId);
    if (!winner || !loser) {
      return;
    }
    await voteForMovie(winnerId, winner.title, winner.poster_path, 10);
    await voteForMovie(loserId, loser.title, loser.poster_path, 0);
    let [movie1, movie2] = getRandomPair(movieList);
    setMovie1(movie1);
    setMovie2(movie2);
  };

  const skipMovie = (movieId: number | undefined, one_or_two: number) => {
    if (!movieId) {
      return;
    }
    setMovieList(movieList.filter((movie) => movie.id !== movieId));
    if (one_or_two === 1) {
      setMovie1(getRandomMovie(movieList));
    } else {
      setMovie2(getRandomMovie(movieList));
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Which movie is better?</Text>
      <View style={styles.comparisonRow}>
        <View style={styles.card}>
          <Image
            source={{ uri: getTMDBImage(movie1?.poster_path) }}
            style={styles.poster}
          />
          <Text style={styles.movieTitle}>{movie1?.title}</Text>
          <TouchableOpacity
            style={styles.voteButton}
            onPress={() => vote(movie1?.id, movie2?.id)}
          >
            <Text style={styles.voteButtonText}>Vote for this movie</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => skipMovie(movie1?.id, 1)}
          >
            <Text style={styles.skipButtonText}>
              Haven't watched this movie
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Image
            source={{ uri: getTMDBImage(movie2?.poster_path) }}
            style={styles.poster}
          />
          <Text style={styles.movieTitle}>{movie2?.title}</Text>
          <TouchableOpacity
            style={styles.voteButton}
            onPress={() => vote(movie2?.id, movie1?.id)}
          >
            <Text style={styles.voteButtonText}>Vote for this movie</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => skipMovie(movie2?.id, 2)}
          >
            <Text style={styles.skipButtonText}>
              Haven't watched this movie
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
    justifyContent: "center",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: "#1a1a1a",
  },
  comparisonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  poster: { width: "100%", height: 180, borderRadius: 8, marginBottom: 8 },
  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  voteButton: {
    backgroundColor: "#90ee90",
    width: "100%",
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 6,
    alignItems: "center",
  },
  voteButtonText: { color: "#6c757d", fontWeight: "bold", fontSize: 13 },
  skipButton: {
    backgroundColor: "#90ee90",
    width: "100%",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  skipButtonText: { color: "#6c757d", fontSize: 11 },
});

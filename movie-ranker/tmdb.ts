export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
}

const API_KEY = "8cf43ad9c085135b9479ad5cf6bbcbda"; // this is free for everyone which is why I published to github
const url = "https://api.themoviedb.org/3";

export const getMoviesFromTMDB = async (): Promise<TMDBMovie[]> => {
  const response = await fetch(
    `${url}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
  );
  const data = await response.json();
  console.log(data.results);
  return data.results || [];
};

export const getTMDBImage = (path: string | undefined) => {
  if (!path) {
    return "";
  }
  return `https://image.tmdb.org/t/p/w500${path}`;
};

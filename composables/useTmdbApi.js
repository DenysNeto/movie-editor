import { useI18n } from "vue-i18n";

export const useTmdbApi = () => {
  const config = useRuntimeConfig();
  const API_KEY = config.public.tmdbApiKey;
  const BASE_URL = "https://api.themoviedb.org/3";

  const { locale } = useI18n();

  /**
   * Общая функция для выполнения запросов к TMDB API.
   * @param {string} endpoint - Конечная точка API (например, '/movie/popular').
   * @param {object} params - Дополнительные параметры запроса.
   * @returns {Promise<object>} - Промис, который разрешается данными от API.
   */
  async function fetchFromTmdb(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append("api_key", API_KEY);
    url.searchParams.append("language", params.language || locale.value);

    for (const key in params) {
      url.searchParams.append(key, params[key]);
    }

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Ошибка при запросе к TMDB API (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Получает список популярных фильмов.
   * @param {number} page - Номер страницы.
   * @returns {Promise<object>} - Промис с данными о популярных фильмах.
   */
  async function getPopularMovies(page = 1) {
    return fetchFromTmdb("/movie/popular", { page });
  }

  /**
   * Получает список жанров фильмов.
   * @returns {Promise<object>} - Промис с данными о жанрах.
   */

  async function getMovieGenres(language = "en-US") {
    return fetchFromTmdb("/genre/movie/list", { language });
  }

  /**
   * Ищет фильмы по заданным критериям.
   * @param {object} options - Объект с параметрами поиска (например, query, genre, year).
   * @returns {Promise<object>} - Промис с результатами поиска фильмов.
   */
  async function searchMovies(options = {}) {
    const { query, genre, year, page = 1 } = options;
    let endpoint = "/discover/movie";
    const params = { page };

    if (query) {
      endpoint = "/search/movie";
      params.query = query;
    }
    if (genre) {
      params.with_genres = genre;
    }
    if (year) {
      params.primary_release_year = year;
    }

    return fetchFromTmdb(endpoint, params);
  }

  async function getMovieCredits(movieId, language) {
    return fetchFromTmdb(`/movie/${movieId}/credits`, { language });
  }
  async function getMovieDetails(movieId, language) {
    return fetchFromTmdb(`/movie/${movieId}`, { language });
  }

  /**
   * Получает детали о человеке (актере/режиссере).
   * @param {number} personId - ID человека.
   * @param {string} language - Код языка (например, 'ru-RU' для русского).
   * @returns {Promise<object>} - Промис с данными о человеке.
   */
  async function getPersonDetails(personId, language) {
    return fetchFromTmdb(`/person/${personId}`, { language });
  }

  /**
   * Получает фильмографию человека (фильмы, в которых он участвовал).
   * @param {number} personId - ID человека.
   * @param {string} language - Код языка (например, 'ru-RU' для русского).
   * @returns {Promise<object>} - Промис с фильмографией человека.
   */
  async function getPersonMovieCredits(personId, language) {
    return fetchFromTmdb(`/person/${personId}/movie_credits`, { language });
  }

  async function getRecommendedMovies(movieId, language) {
    return fetchFromTmdb(`/movie/${movieId}/recommendations`, { language });
  }

  async function getSimilarMovies(movieId, language) {
    return fetchFromTmdb(`/movie/${movieId}/similar`, { language });
  }

  const getMovieVideos = async (movieId, language = "en-US") => {
    return fetchFromTmdb(`/movie/${movieId}/videos`, { language });
  };

  const getNowPlayingMovies = async (language = "en-US", page = 1) => {
    return fetchFromTmdb("/movie/now_playing", { language, page });
  };

  const getUpcomingMovies = async (language = "en-US", page = 1) => {
    return fetchFromTmdb("/movie/upcoming", { language, page });
  };

  const getTopRatedMovies = async (language = "en-US", page = 1) => {
    return fetchFromTmdb("/movie/top_rated", { language, page });
  };

  function handlePosterUrl(movies) {
    return movies.map((el) => {
      return {
        ...el,
        posterUrl: `https://image.tmdb.org/t/p/w500${el.poster_path}`,
      };
    });
  }

  return {
    getNowPlayingMovies,
    getUpcomingMovies,
    getTopRatedMovies,
    getPopularMovies,
    getMovieVideos,
    getRecommendedMovies,
    getSimilarMovies,
    getPersonDetails,
    getPersonMovieCredits,
    getMovieCredits,
    getMovieDetails,
    handlePosterUrl,
    getMovieGenres,
    searchMovies,
  };
};

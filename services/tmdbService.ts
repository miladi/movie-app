import axios from "axios";
import { IApiResponse, IMovie } from "../models/IMovie";
import { IMovieDetails } from "../models/IMovieDetails";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const AUTHORIZATION_BEARER = process.env.EXPO_PUBLIC_AUTHORIZATION_BEARER;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    accept: "application/json",
    Authorization: AUTHORIZATION_BEARER,
  },
});

export const fetchMovies = async (page: number = 1): Promise<IMovie[]> => {
  try {
    const response = await axios.get<IApiResponse>(
      `${BASE_URL}/movie/popular`,
      {
        params: {
          api_key: API_KEY,
          language: "en-US",
          page,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const fetchMovieDetails = async (
  movieId: number
): Promise<IMovieDetails> => {
  const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits`;

  try {
    const response = await axios.get(url);

    const data: IMovieDetails = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<IMovie[]> => {
  try {
    const response = await instance.get<IApiResponse>(`/search/movie`, {
      params: {
        api_key: API_KEY,
        language: "en-US",
        query,
        page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const createGuestSession = async (): Promise<string> => {
  try {
    const response = await instance.get("/authentication/guest_session/new");
    return response.data.guest_session_id;
  } catch (error) {
    console.error("Error creating guest session:", error);
    throw error;
  }
};

export const rateMovie = async (
  movieId: number,
  rating: number,
  guestSessionId: string
) => {
  try {
    const response = await instance.post(
      `/movie/${movieId}/rating`,
      { value: rating },
      {
        params: { guest_session_id: guestSessionId },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error rating movie:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }

    throw error;
  }
};

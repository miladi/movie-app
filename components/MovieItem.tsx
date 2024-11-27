import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Alert,
  Share,
} from "react-native";
import { IMovie } from "../models/IMovie";
import { createGuestSession, rateMovie } from "../services/tmdbService";
import StarRating from "react-native-star-rating-widget";

interface MovieItemProps {
  movie: IMovie;
  toggleFavorite: (movie: IMovie) => void;
  isFavorite: boolean;
}

const genresMap: { [key: number]: string } = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
};

function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const MovieItem: React.FC<MovieItemProps> = ({
  movie,
  toggleFavorite,
  isFavorite,
}) => {
  const [rating, setRating] = useState<number>(0);

  const genreNames = movie.genre_ids
    .map((id) => genresMap[id])
    .filter((x) => x)
    .join(", ");

  const handleRatingChange = async (newRating: number) => {
    const roundedRating = Math.round(newRating);

    if (roundedRating !== rating) {
      try {
        const guestSessionId = await createGuestSession();
        await rateMovie(movie.id, roundedRating * 2, guestSessionId);

        setRating(roundedRating);
        Alert.alert(
          "Rating Submitted",
          `You have successfully rated "${movie.title}" with ${
            roundedRating * 2
          } points. Thank you for your feedback!`
        );
      } catch (error) {
        console.error("Failed to rate movie:", error);
        Alert.alert(
          "Submission Error",
          "There was an error submitting your rating. Please try again later."
        );
      }
    }
  };

  const debouncedHandleRatingChange = useCallback(
    debounce(handleRatingChange, 300),
    []
  );

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `${movie.title}\n\nGenre(s): ${
          genreNames || "Unknown"
        }\nRelease Date: ${movie.release_date || "N/A"}\nRating: ${
          movie.vote_average != null ? movie.vote_average.toFixed(1) : "N/A"
        }`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          Alert.alert("Shared!", `Movie shared via ${result.activityType}`);
        } else {
          Alert.alert("Success!", "Movie details were shared successfully.");
        }
      } else if (result.action === Share.dismissedAction) {
        Alert.alert("Cancelled", "Movie sharing was cancelled.");
      }
    } catch (error) {
      Alert.alert("Error", "There was an issue sharing the movie.");
    }
  };

  return (
    <View style={styles.movieItem}>
      <View>
        <Image
          source={{
            uri: movie.poster_path
              ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
              : "https://via.placeholder.com/200x300?text=No+Image",
          }}
          style={styles.poster}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text>Release Date: {movie.release_date || "N/A"}</Text>
        <Text>Genres: {genreNames || "Unknown"}</Text>
        <Text>
          Rating:{" "}
          {movie.vote_average != null ? movie.vote_average.toFixed(1) : "N/A"}
        </Text>

        <View style={styles.ratingContainer}>
          <StarRating
            rating={rating}
            onChange={debouncedHandleRatingChange}
            maxStars={5}
            starSize={25}
          />
        </View>
        <Button
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          onPress={() => toggleFavorite(movie)}
        />
        <Button title="Share" onPress={handleShare} color="green" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  movieItem: {
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 5,
    backgroundColor: "#ddd",
  },
  details: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ratingContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default MovieItem;

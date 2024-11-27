import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { FavoritesScreenRouteProp } from "../types/navTypes";

const FavoritesScreen: React.FC = () => {
  const route = useRoute<FavoritesScreenRouteProp>();
  const { favorites } = route.params;

  return (
    <ScrollView style={styles.container}>
      {favorites.map((movie) => (
        <View key={movie.id} style={styles.movieItem}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
            }}
            style={styles.poster}
          />
          <View style={styles.details}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text>Release Date: {movie.release_date}</Text>
            <Text>
              Genres:{" "}
              {movie.details.genres.map((genre) => genre.name).join(", ")}
            </Text>
            <Text>Rating: {movie.vote_average.toFixed(1)}</Text>
            <Text>Runtime: {movie.details.runtime} minutes</Text>
            <Text>Budget: ${movie.details.budget.toLocaleString()}</Text>
            <Text>Overview: {movie.details.overview}</Text>
            <Text style={styles.subTitle}>Cast:</Text>
            {movie.details.credits.cast.slice(0, 5).map((castMember) => (
              <Text key={castMember.cast_id}>
                {castMember.name} as {castMember.character}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
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
  subTitle: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "600",
  },
});

export default FavoritesScreen;

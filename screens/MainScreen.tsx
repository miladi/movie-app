import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  Button,
  SafeAreaView,
  Image,
  Dimensions,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MovieItem from "../components/MovieItem";
import Carousel from "react-native-reanimated-carousel";
import { IMovie } from "../models/IMovie";
import {
  fetchMovies,
  fetchMovieDetails,
  searchMovies,
} from "../services/tmdbService";
import {
  MainScreenNavigationProp,
  MainScreenRouteProp,
} from "../types/navTypes";

type Props = {
  navigation: MainScreenNavigationProp;
  route: MainScreenRouteProp;
};

const MOVIES_KEY = "@movies_cache";

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<IMovie[]>([]);

  const flatListRef = useRef<FlatList<IMovie>>(null);

  useEffect(() => {
    getMovies();
  }, []);

  const getMovies = async () => {
    if (loadingMore) return;
    try {
      setLoadingMore(true);
      const moviesData = await fetchMoviesData(searchQuery, page);
      setMovies((prevMovies) =>
        page === 1 ? moviesData : [...prevMovies, ...moviesData]
      );

      if (page === 1 && flatListRef.current) {
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
      }

      await AsyncStorage.setItem(
        MOVIES_KEY,
        JSON.stringify([...movies, ...moviesData])
      );
      if (moviesData.length > 0) setPage(page + 1);
    } catch (error) {
      console.error("Failed to load movies:", error);
      const cachedMovies = await AsyncStorage.getItem(MOVIES_KEY);
      if (cachedMovies) {
        setMovies(JSON.parse(cachedMovies));
      } else {
        Alert.alert("Failed to load movies");
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchMoviesData = async (query: string, pageNumber: number) => {
    if (query.trim()) {
      return searchMovies(query, pageNumber);
    } else {
      return fetchMovies(pageNumber);
    }
  };

  const toggleFavorite = async (movie: IMovie) => {
    if (favorites.some((fav) => fav.id === movie.id)) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== movie.id));
    } else {
      try {
        const movieDetails = await fetchMovieDetails(movie.id);
        setFavorites((prev) => [...prev, { ...movie, details: movieDetails }]);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
        Alert.alert("Failed to add movie to favorites");
      }
    }
  };

  const renderEmptyList = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No movies found.</Text>
      </View>
    );
  };

  const renderFooter = () => {
    return loadingMore ? <ActivityIndicator size="large" color="blue" /> : null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {movies.length > 0 && (
        <View style={styles.carouselContainer}>
          <Carousel
            style={{ backgroundColor: "black" }}
            width={Dimensions.get("screen").width}
            height={200}
            data={movies.slice(0, 10)}
            autoPlay={true}
            renderItem={({ item }) => (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                }}
                style={styles.poster}
                resizeMode="contain"
              />
            )}
          />
        </View>
      )}

      <TextInput
        returnKeyType="search"
        style={styles.searchBar}
        placeholder="Search by title..."
        value={searchQuery}
        onChangeText={(text) => {
          if (!text) getMovies();
          setSearchQuery(text);
          setPage(1);
        }}
        onSubmitEditing={() => {
          getMovies();
        }}
      />

      <FlatList
        ref={flatListRef}
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            toggleFavorite={toggleFavorite}
            isFavorite={!!favorites.find((fav) => fav.id === item.id)}
          />
        )}
        onEndReached={() => (searchQuery ? null : getMovies())}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.listContainer}
      />
      {favorites.length > 0 && (
        <View style={{ borderTopWidth: 1, borderTopColor: "gray" }}>
          <Button
            title="View Favorites"
            onPress={() => navigation.navigate("Favorites", { favorites })}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    borderRadius: 5,
  },
  carouselContainer: {
    marginBottom: 220,
  },
  poster: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
});

export default MainScreen;

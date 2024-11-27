import { StackNavigationProp } from "@react-navigation/stack";
import { IMovie } from "../models/IMovie";
import { RouteProp } from "@react-navigation/native";
import { IMovieDetails } from "../models/IMovieDetails";

export type RootStackParamList = {
  Home: undefined;
  Favorites: { favorites: IMovie[] };
};

export type MainScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;
export type MainScreenRouteProp = RouteProp<RootStackParamList, "Home">;
export type FavoritesScreenRouteProp = RouteProp<
{ Favorites: { favorites: IMovieDetails[] } },
"Favorites"
>;
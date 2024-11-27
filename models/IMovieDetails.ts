import { IMovie } from "./IMovie";

export interface IMovieDetails extends IMovie {
    details: IMovieDetailsExtended;
  }
  
  interface IMovieDetailsExtended {
    adult: boolean;
    backdrop_path: string;
    belongs_to_collection: ICollection;
    budget: number;
    genres: IGenre[];
    homepage: string;
    id: number;
    imdb_id: string;
    origin_country: string[];
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: IProductionCompany[];
    production_countries: IProductionCountry[];
    release_date: string;
    revenue: number;
    runtime: number;
    spoken_languages: ISpokenLanguage[];
    status: string;
    tagline: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    credits: ICredits;
  }
  
  interface ICollection {
    id: number;
    name: string;
    poster_path: string;
    backdrop_path: string;
  }
  
  interface IGenre {
    id: number;
    name: string;
  }
  
  interface IProductionCompany {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }
  
  interface IProductionCountry {
    iso_3166_1: string;
    name: string;
  }
  
  interface ISpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
  }
  
  interface ICredits {
    cast: ICastMember[];
    crew: ICrewMember[];
  }
  
  interface ICastMember {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
  }
  
  interface ICrewMember {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    credit_id: string;
    department: string;
    job: string;
  }
  
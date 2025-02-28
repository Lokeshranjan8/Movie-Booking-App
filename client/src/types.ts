export interface Movie {
    id: number;
    title: string;
    description: string;
    genre: string;
    duration: number;
    rating: number;
    posterUrl: string;
    backdropUrl?: string;
    cast: string[];
    director: string;
    releaseDate: string;
  }
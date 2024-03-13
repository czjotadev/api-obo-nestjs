/* eslint-disable prettier/prettier */
export interface ArtistsInterface {
  id: string;
  biography: string;
  instagram: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
  userArtistImage: {
    id: string;
    name: string;
    path: string;
  }[];
}

export class CreateProductDto {
  userArtistId: string;
  name: string;
  price: number;
  urlName?: string;
  description: string;
  productCategoryId: string;
  active: string;
  showcase: string;
}

export class CreateProductDto {
  userArtistId: string;
  name: string;
  urlName?: string;
  description: string;
  productCategoryId: string;
  active: string;
  showcase: string;
}

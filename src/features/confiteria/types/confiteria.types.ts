export interface SnackProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  hasPromo: boolean;
  promoLabel?: string;
  discountPercent?: number;
  isFeatured?: boolean;
}

export interface CartItem {
  product: SnackProduct;
  quantity: number;
}
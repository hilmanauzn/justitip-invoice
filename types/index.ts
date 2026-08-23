export interface MenuItem {
  id: string;
  idRestaurant: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  includeJastip: boolean;
  jastipFeeSpecial?: number;
  addon?: string[];
  image?: string;
  available: boolean;
}

export interface RestaurantItem {
  id: string;
  name: string;
  jastipFee: number;
  multiple: number;
  taxService?: number;
  taxCharge?: number;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  cartItemId: string; // ID unik untuk membedakan item dengan addon berbeda
  selectedAddon?: string;
}

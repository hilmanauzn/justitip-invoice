export interface MenuItem {
  id: string;
  idRestaurant: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  includeJastip?: boolean;
  image?: string;
  available: boolean;
  jastipFeeSpecial?: number;
  addon?: Array<string>;
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
}


export interface ServiceStats {
  brand: number;
  conversion: number;
  reach: number;
}

export interface Resources {
  photos: number;
  videos: number;
  posts: number;
  hours: number; // For development/consultancy hours
}

export interface Tier {
  id: 'essential' | 'pro' | 'premium';
  name: string; 
  price: number;
  discountPrice?: number; // Optional discounted price for bundles/specials
  duration: number;
  // Added 'months' to support monthly recurring services
  unit: 'days' | 'weeks' | 'hours' | 'months';
  description: string;
  resources: Resources; // New: Tangible deliverables
}

export interface Service {
  id: string;
  name: string;
  description: string; 
  tiers: Tier[];       
  stats: ServiceStats;
  relatedServiceIds: string[]; // New: For lightbulb recommendations
}

export interface ProjectObjective {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  recommendedServiceIds: string[];
}

export interface Subcategory {
  id: string;
  title: string;
  services: Service[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  subcategories: Subcategory[];
}

export interface SelectedService {
  serviceId: string;
  tierId: 'essential' | 'pro' | 'premium';
  price: number;
  duration: number;
  stats: ServiceStats;
  resources: Resources;
}

// Added SelectedServiceUI to handle name property in UI components
export interface SelectedServiceUI extends SelectedService {
  name: string;
}

export interface Totals {
  originalPrice: number; // Price before any discount
  synergyDiscountAmount: number; // Amount saved by synergy
  portfolioDiscountAmount: number; // Amount saved by portfolio
  finalPrice: number;    // Price after all discounts
  minDays: number;
  maxDays: number;
  synergyLevel: number; // 0, 1 (10%), 2 (15%)
  isPortfolioActive: boolean;
  totalStats: ServiceStats;
  totalResources: Resources;
}

export interface Recommendation {
  type: 'opportunity' | 'oversale';
  text: string;
  serviceId: string; // The service to add OR remove
  serviceName: string;
  potentialStats?: ServiceStats;
}

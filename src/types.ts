export interface ItineraryActivity {
  time: string;
  activity: string;
  description: string;
  location: string;
  cost: string;
  duration: string;
  category: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  theme: string;
  activities: ItineraryActivity[];
}

export interface HotelRecommendation {
  name: string;
  description: string;
  priceRange: string;
  rating: string;
  location: string;
  whyItFits: string;
}

export interface FoodRecommendation {
  dishName: string;
  description: string;
  restaurantSuggest: string;
  cuisine: string;
  priceLevel: string;
  location: string;
}

export interface PackingCategory {
  category: string;
  items: string[];
}

export interface BudgetBreakdown {
  transportation: string;
  accommodation: string;
  food: string;
  activities: string;
  miscellaneous: string;
}

export interface TransportationGuide {
  howToReach: string;
  localOptions: string;
  estimatedCosts: string;
}

export interface TravelSummary {
  totalEstimatedCost: string;
  bestExperiences: string[];
  importantAdvice: string[];
}

export interface TravelPlan {
  destination: string;
  tagline: string;
  bestTimeToVisit: string;
  vibeSummary: string;
  itinerary: DayItinerary[];
  hotels: HotelRecommendation[];
  foodRecommendations: FoodRecommendation[];
  packingList: PackingCategory[];
  budgetBreakdown?: BudgetBreakdown;
  transportationGuide?: TransportationGuide;
  budgetTips?: string[];
  summary?: TravelSummary;
  markdownPlan?: string;
}

export interface SavedTrip {
  id: string;
  plan: TravelPlan;
  createdAt: string;
  budget: string;
  days: number;
  companion: string;
  preferences: string;
}

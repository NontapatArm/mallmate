import type { Mall, Store } from "./types";

export const MALLS: Mall[] = [
  { id: 1, icon: "🏢", name: "Central World",      dist: "2.3", cnt: "500+", featured: true  },
  { id: 2, icon: "🏬", name: "Siam Paragon",       dist: "1.8", cnt: "350+", featured: false },
  { id: 3, icon: "🏘️", name: "EmQuartier",         dist: "3.1", cnt: "280+", featured: false },
  { id: 4, icon: "🏪", name: "The Mall Bangkapi",  dist: "5.2", cnt: "220+", featured: false },
];

export const STORES: Store[] = [
  { id: 1, icon: "🍽️", name: "Siam Kitchen", floor: "L3", wait: 28, type: "restaurant" },
  { id: 2, icon: "🍜", name: "Ramen House",  floor: "L2", wait: 15, type: "restaurant" },
  { id: 3, icon: "☕", name: "Café Amazon",  floor: "G",  wait: 8,  type: "restaurant" },
  { id: 4, icon: "👗", name: "Zara",         floor: "L1", wait: 0,  type: "shopping"   },
  { id: 5, icon: "💊", name: "Watsons",      floor: "G",  wait: 0,  type: "services"   },
];

export const PARKING_SPOTS = [
  "A1","A2","A3","A4",
  "B1","B2","B3","B4",
  "C1","C2","C3","C4",
];

export const OCCUPIED_SPOTS = ["A2", "B3", "C1"];

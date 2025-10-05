export type Page = 'home' | 'dashboard' | 'training-grounds' | 'learning-center' | 'data-explorer' | 'live-analysis';

export interface Exoplanet {
  id: string;
  name: string;
  radius: number; // Earth radii
  mass: number; // Earth masses
  orbitalPeriod: number; // days
  insolation: number; // Earth flux - how much energy it gets from its star
  discoveryMethod: string;
  starType: string; // e.g., 'G-type (Sun-like)', 'M-type (Red Dwarf)'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface GameCard {
  id: number;
  type: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface LightCurvePoint {
  time: number;
  flux: number;
}

export interface LightCurveData {
  id: number;
  data: LightCurvePoint[];
  isTransit: boolean;
  explanation: string;
}

// --- NASA API Data Types ---

export interface NasaExoplanet {
  pl_name: string;
  pl_rade: number; // Planet Radius [Earth radii]
  st_dist: number; // Distance to Planet Host Star [parsec]
  pl_insol: number; // Insolation Flux [Earth flux]
  pl_orbper: number; // Orbital Period [days]
}

export interface ExplorerPlanet {
  name: string;
  type: string;
  distance: number; // in light years
  radius: number; // in earth radii
  esi: number;
}
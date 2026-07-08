export interface Provider {
  provider: string;
  provider_name: string;
}

export interface FilterObject {
  s?: string;
  w?: string;
  n?: string;
  e?: string;
  isSingleDayTourPossible?: boolean;
  isSummerTourPossible?: boolean;
  isWinterTourPossible?: boolean;
  isMultipleDayTourPossible?: boolean;
  isTraversePossible?: boolean;
  singleDayTour?: boolean;
  multipleDayTour?: boolean;
  summerSeason?: boolean;
  winterSeason?: boolean;
  traverse?: boolean;
  minAscent?: number;
  maxAscent?: number;
  minDescent?: number;
  maxDescent?: number;
  minTransportDuration?: number;
  maxTransportDuration?: number;
  minDistance?: number;
  maxDistance?: number;
  ranges?: string[];
  types?: string[];
  languages?: string[];
  difficulties?: number[];
  providers?: string[];
  countries?: string[];
}

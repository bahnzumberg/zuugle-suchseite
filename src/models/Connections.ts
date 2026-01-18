export interface ConnectionResult {
  date: string;
  connections: Connection[];
  returns: Connection[];
}
export interface Connection {
  calendar_date: string;
  connection_departure_datetime: string;
  connection_arrival_datetime: string;
  connection_duration: string;
  connection_no_of_transfers: number;
  connection_returns_trips_back: number;
  return_departure_datetime: string;
  return_duration: string;
  return_no_of_transfers: number;
  return_arrival_datetime: string;
  totour_track_duration: string;
  fromtour_track_duration: string;
  connection_description_json: ConnectionDescriptionJSON[];
  return_description_json: ConnectionDescriptionJSON[];
  totour_track_key: number;
  fromtour_track_key: number;
  connection_duration_minutes: number;
  return_duration_minutes: number;
  gpx_file: string;
}

export interface DepartureJSON {
  T: "D";
  DT: string; // DepartureTime
  DS: string; // DepartureStop
}

export interface TransferJSON {
  T: "T";
  TD: string; // TransferDuration
}

export interface ArrivalJSON {
  T: "A";
  AT: string; // ArrivalTime
  AS: string; // ArrivalStop
}

export interface ConnectionJSON {
  T: "C";
  CD: string; // ConnectionDuration
  CN: string; // ConnectionName
  CT: ConnectionType; // ConnectionType
  CI?: string; // ConnectionInfo for example "Rufbus, Reservierung unter +431234567"
}

export type ConnectionDescriptionJSON =
  | DepartureJSON
  | TransferJSON
  | ArrivalJSON
  | ConnectionJSON;

export enum ConnectionType {
  TRAIN = 1,
  BUS = 2,
  TRAM = 3,
  SUBWAY = 4,
  MONORAIL = 5,
  COG_TRAIN = 6,
  FUNICULAR = 7,
  CABLE_CAR = 8,
  FERRY = 9,
  TAXI = 10,
  OTHER = 20,
}

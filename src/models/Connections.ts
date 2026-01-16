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
  return_description_json: ReturnDescriptionJSON[];
  totour_track_key: number;
  fromtour_track_key: number;
  connection_duration_minutes: number;
  return_duration_minutes: number;
  gpx_file: string;
}

interface DepartureJSON {
  T: "D";
  DT: string; // DepartureTime
  DS: string; // DepartureStop
}

interface TransferJSON {
  T: "T";
  TD: string; // TransferDuration
}

interface ArrivalJSON {
  T: "A";
  AT: string; // ArrivalTime
  AS: string; // ArrivalStop
}

interface ConnectionJSON {
  T: "C";
  CD: string; // ConnectionDuration
  CN: string; // ConnectionName
  CT: number; // ConnectionType
  CI?: string; // ConnectionInfo for example "Rufbus, Reservierung unter +431234567"
}

type ReturnDescriptionJSON =
  | DepartureJSON
  | TransferJSON
  | ArrivalJSON
  | ConnectionJSON;

type ConnectionDescriptionJSON =
  | DepartureJSON
  | TransferJSON
  | ArrivalJSON
  | ConnectionJSON;

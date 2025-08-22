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
interface ReturnDescriptionJSON {
  T: string;
  DS?: string;
  DT?: string;
  CD?: string;
  CN?: string;
  CT?: number;
  AS?: string;
  AT?: string;
  TD?: string;
}
interface ConnectionDescriptionJSON {
  T: string;
  DS?: string;
  DT?: string;
  CD?: string;
  CN?: string;
  CT?: number;
  AS?: string;
  AT?: string;
}

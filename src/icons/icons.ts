// Import all SVGs as React components
import { ReactComponent as TransportWalk } from "./svg/ic_transport_walk.svg";
import { ReactComponent as TransportTrain } from "./svg/ic_transport_train.svg";
import { ReactComponent as TransportBus } from "./svg/ic_transport_bus.svg";
import { ReactComponent as Tram } from "./svg/ic_tram.svg";
import { ReactComponent as Überschreitung } from "./svg/ic_überschreitung.svg";
import { ReactComponent as ShuffleBlack } from "./../icons/svg/ic_shuffle_black.svg";
import { ReactComponent as Intensity } from "./../icons/svg/intensity.svg";
import { ReactComponent as List } from "./../icons/svg/list.svg";
import { ReactComponent as Map } from "./svg/map.svg";
import { ReactComponent as Rückreise } from "./../icons/svg/ic_rückreise.svg";
import { ReactComponent as SearchIcon } from "./../icons/svg/ic_search.svg";
import { ReactComponent as Seilbahn } from "./svg/seilbahn.svg";
import { ReactComponent as ShareIcon } from "./svg/actions/share.svg";
import { ReactComponent as Shuffle } from "./../icons/svg/ic_shuffle.svg";
import { ReactComponent as Anreise } from "./svg/ic_anreise.svg";
import { ReactComponent as ArrowBefore } from "./svg/arrow-before.svg";
import { ReactComponent as Car } from "./svg/ic_car.svg";
import { ReactComponent as ClearSearchIcon } from "./../icons/svg/ic_search_clear.svg";
import { ReactComponent as DownloadIcon } from "./svg/actions/download.svg";
import { ReactComponent as FilterIcon } from "./../icons/svg/ic_filter_2.svg";
import { ReactComponent as GoIcon } from "./../icons/svg/ic_go.svg";
import { ReactComponent as Close } from "./../icons/svg/ic_close.svg";

export const icons = {
  transportWalk: TransportWalk,
  transportTrain: TransportTrain,
  transportBus: TransportBus,
  tram: Tram,
  überschreitung: Überschreitung,
  shuffleBlack: ShuffleBlack,
  intensity: Intensity,
  list: List,
  map: Map,
  anreise: Anreise,
  rückreise: Rückreise,
  searchIcon: SearchIcon,
  seilbahn: Seilbahn,
  shareIcon: ShareIcon,
  shuffle: Shuffle,
  arrowBefore: ArrowBefore,
  car: Car,
  clearSearchIcon: ClearSearchIcon,
  downlaodIcon: DownloadIcon,
  filterIcon: FilterIcon,
  goIcon: GoIcon,
  close: Close,
  // etc.
};

export type IconName = keyof typeof icons;

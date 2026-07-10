import TransportWalk from "./svg/ic_transport_walk.svg?react";
import TransportTrain from "./svg/ic_transport_train.svg?react";
import TransportBus from "./svg/ic_transport_bus.svg?react";
import Tram from "./svg/ic_tram.svg?react";
import Überschreitung from "./svg/ic_überschreitung.svg?react";
import ShuffleBlack from "./svg/ic_shuffle_black.svg?react";
import Intensity from "./svg/intensity.svg?react";
import List from "./svg/list.svg?react";
import Map from "./svg/map.svg?react";
import Rückreise from "./svg/ic_rückreise.svg?react";
import SearchIcon from "./svg/ic_search.svg?react";
import Seilbahn from "./svg/seilbahn.svg?react";
import ShareIcon from "./svg/actions/share.svg?react";
import Shuffle from "./svg/ic_shuffle.svg?react";
import Anreise from "./svg/ic_anreise.svg?react";
import ArrowBefore from "./svg/arrow-before.svg?react";
import Car from "./svg/ic_car.svg?react";
import ClearSearchIcon from "./svg/ic_search_clear.svg?react";
import DownloadIcon from "./svg/actions/download.svg?react";
import FilterIcon from "./svg/ic_filter_2.svg?react";
import GoIcon from "./svg/ic_go.svg?react";
import Close from "./svg/ic_close.svg?react";

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

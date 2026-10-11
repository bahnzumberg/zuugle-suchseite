import TransportWalk from "../../../../assets/public/icons/ic_transport_walk.svg?react";
import TransportTrain from "../../../../assets/public/icons/ic_transport_train.svg?react";
import TransportBus from "../../../../assets/public/icons/ic_transport_bus.svg?react";
import Tram from "../../../../assets/public/icons/ic_tram.svg?react";
import Überschreitung from "../../../../assets/public/icons/ic_überschreitung.svg?react";
import ShuffleBlack from "../../../../assets/public/icons/ic_shuffle_black.svg?react";
import Intensity from "../../../../assets/public/icons/intensity.svg?react";
import List from "../../../../assets/public/icons/list.svg?react";
import Map from "../../../../assets/public/icons/map.svg?react";
import Rückreise from "../../../../assets/public/icons/ic_rückreise.svg?react";
import SearchIcon from "../../../../assets/public/icons/ic_search.svg?react";
import Seilbahn from "../../../../assets/public/icons/seilbahn.svg?react";
import ShareIcon from "../../../../assets/public/icons/actions/share.svg?react";
import Shuffle from "../../../../assets/public/icons/ic_shuffle.svg?react";
import Anreise from "../../../../assets/public/icons/ic_anreise.svg?react";
import ArrowBefore from "../../../../assets/public/icons/arrow-before.svg?react";
import Car from "../../../../assets/public/icons/ic_car.svg?react";
import ClearSearchIcon from "../../../../assets/public/icons/ic_search_clear.svg?react";
import DownloadIcon from "../../../../assets/public/icons/actions/download.svg?react";
import FilterIcon from "../../../../assets/public/icons/ic_filter_2.svg?react";
import GoIcon from "../../../../assets/public/icons/ic_go.svg?react";
import Close from "../../../../assets/public/icons/ic_close.svg?react";

export { TransportTrain };

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

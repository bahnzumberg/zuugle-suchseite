import * as React from 'react';
import {useLocation} from 'react-router-dom';
import MatomoTracker from '@jonkoops/matomo-tracker'
export function useMatomo({
  enableAutoPageTrack,
  enableLinkTracking,
  hostConfig: {
    url,
    siteId
  }
}) {
  //console.log("creating tracker")
  const tracker = new MatomoTracker({
    urlBase: url,
    siteId,
    linkTracking: enableLinkTracking,
  })
  if (enableAutoPageTrack) {
    const location = useLocation();
    //console.log(location)
    React.useEffect(() => {
      //console.log('calling tracker from effect')
      tracker.trackPageView();
    }, [location])
  }
  // page view
  // track event
}

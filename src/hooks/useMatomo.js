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

    const tracker = new MatomoTracker({
        urlBase: url,
        siteId,
        linkTracking: enableLinkTracking,
        configurations: {
            disableCookies: true
        }
    })
    if (enableAutoPageTrack) {
        const location = useLocation();
        React.useEffect(() => {
            tracker.trackPageView();
        }, [location.pathname])
    }
}

import * as React from 'react';
import {useLocation} from 'react-router-dom';
import MatomoTracker from '@jonkoops/matomo-tracker'

/**
 * A simple hook wrapping the MatomoTracker class provided by @jonkoops/matomo-tracker.
 * Unfortunately, this package is no longer actively maintained but I believe it is not very likely that the Matomo API will change a lot in the future.
 * If it is necessary to remove the package only this hook should be affected and there should be no need to change the rest of the codebase.
 */

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

import express from 'express';
let router = express.Router();
import knex from "../knex";
import logger from "../utils/logger";

var crypto = require('crypto');

router.post('/', (req, res) => newShareWrapper(req, res));
router.get('/:shareId', (req, res) => getCorrespondingLinkWrapper(req, res));


// Description: newShareMapper generates a new uuid which will be the unique link (or reuses the already existing one)
// body: {
//   "provider": string,
//   "hashedUrl": string
//   "date": string, // date needs to be conformed to ISO-8601 standards
//   "city": string
// }
// response: {
//   success: true //or false if something went wrong, most likely the body wasn't correct
//   "shareId": ...
// }
//
const newShareWrapper = async (req, res) => {
    //Generating shareId for unique link
    // const shareId = crypto.randomUUID();
    const shareId = crypto.createHash('sha256')
    try {
        //Use this code as well, if you don't want to generate a new link if one already exists
        /*const doesExist = await knex('disposible')
            .select('link')
            .whereRaw('LOWER(provider) = LOWER(?)', req.body.provider)
            .whereRaw('LOWER(hashed_url) = LOWER(?)', req.body.hashedUrl);
        if (typeof doesExist[0] !== 'undefined') {
            console.log(doesExist[0]);
            res.status(200).json({ success: true, shareId: doesExist[0].link });
            return;
        }*/

        //Inserting new share link
        await knex('disposible')
            .insert({
                provider: req.body.provider,
                hashed_url: req.body.hashedUrl,
                link: shareId,
                calendar_date: req.body.date,
                city_slug: req.body.city
        })
            .then((result) => {
                res.status(200).json({ success: true, shareId: shareId });
            })
    } catch (error) {
        console.log('Error inserting link. ' + error);
        res.status(500).json({ success: false, error: 'Failed to generate link.' });
    }
}

// Description: Retrieves data for a sharing link
// Optional query param: city //this is the city saved by the cookie of the user that opens the link
// response: {
//   "success": true //or false if something went wrong
//   "date": ...,
//   "city": ...,
//   "tourId": ..., //current temporary id of the tour
//   "usedCityOfCookie" //Indicates whether the original city of the generated link or the current user's city (based on the cookie) is returned
// }
const getCorrespondingLinkWrapper = async (req, res) => {
    // logger("==== 1 ========Request===================");
    // logger(JSON.stringify(req.query));  // {}
    //Share id from query param
    const shareId = req.params.shareId;
    // logger("======== 2 =======shareId===================");
    // logger(JSON.stringify(shareId)); // "8ad04f48-0f50-4462-9ecd-f937f19265bc"
    //City of Cookie, when there is none it will be set to null
    let citySlugOfCookie = (req.query && req.query.city) ? req.query.city : null;
    // logger("============ 3 ========= citySlugOfCookie ===================");
    // logger(JSON.stringify(citySlugOfCookie)); // null
    //Variable that changes depending on whether the city of the cookie has been used or the one of the link creator
    let usedCityOfCookie = false;


    try {
        //Getting all data for according shareId
        const shareLinkData  = await knex('disposible')
            .select('calendar_date', 'city_slug', 'hashed_url', 'provider')
            .where('link', shareId);

            // logger("=============== 4 =====shareLinkData[0]===================");
            // logger(JSON.stringify(shareLinkData[0]));
            //{"calendar_date":"2024-01-16T23:00:00.000Z","city_slug":"amstetten","hashed_url":"620","provider":"bahnzumberg"}

        //Failure when the data of the column of the table isn't complete
        if (!shareLinkData[0].calendar_date || !shareLinkData[0].city_slug
            || !shareLinkData[0].hashed_url || !shareLinkData[0].provider) {
            res.status(500).json({ success: false, error: 'Failed to find corresponding link.' });
            return;
        }

        //Gets the current id of the tour
        const id = await knex('tour')
            .select('id')
            .whereRaw('LOWER(provider) = LOWER(?)', shareLinkData[0].provider)
            .whereRaw('LOWER(hashed_url) = LOWER(?)', shareLinkData[0].hashed_url)
            .first();
        // logger("============ 5 ========= id.id ===================");
        // logger(JSON.stringify(id.id)); // 620
        //Formatting of date for select statement
        const date = new Date(shareLinkData[0].calendar_date);

        //When a cookie with a city exists as a query param
        if (citySlugOfCookie) {
            //Checks if there would be a connection from your city to the tour
            const reachableTourConnections  = await knex('fahrplan')
                .count()
                .whereRaw('LOWER(tour_provider) = LOWER(?)', shareLinkData[0].provider)
                .whereRaw('LOWER(hashed_url) = LOWER(?)', shareLinkData[0].hashed_url)
                .whereRaw('LOWER(city_slug) = LOWER(?)', citySlugOfCookie)
                .whereRaw('DATE(calendar_date) = ?', date);
            
                // logger("================  6 ===== reachableTourConnections[0]===================");
                // logger(JSON.stringify(reachableTourConnections[0]));
            //Use the city of the link creator when there isn't a connection available
            if (reachableTourConnections[0].count < 1) {
                citySlugOfCookie = shareLinkData[0].city_slug;
                // logger("== 7 =========  citySlugOfCookie (count < 1) ===================");
                // logger(JSON.stringify(citySlugOfCookie));
                // logger("==============   E N D ===================");
            } else {
                usedCityOfCookie = true;
            }
        } else {
            //Use the city of the link creator when there was no city query param
            citySlugOfCookie = shareLinkData[0].city_slug;
        }
        res.status(200).json({success: true, date: shareLinkData[0].calendar_date, city: citySlugOfCookie, tourId: id.id, usedCityOfCookie: usedCityOfCookie});

    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to find corresponding link. Either this share link is wrong, has expired or this tour does not exist anymore.' });
    }
}

export default router;
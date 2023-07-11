import express from 'express';
let router = express.Router();
import knex from "../knex";

router.get('/', (req, res) => newShareWrapper(req, res));
router.get('/:uuid', (req, res) => getCorrespondingLinkWrapper(req, res));


// Description: newShareMapper generates a new uuid which will be the unique link (or reuses the already existing one)
// body: {
//   "provider": string,
//   "hashedUrl": string
//   "date": string, // date needs to be of this format: yyyy-mm-dd hh-mm-ss.nnnnnn(+/- offset to utc time)
//   "city": string
// }
// response: {
//   success: true //or false if something went wrong, most likely the body wasn't correct
//   "shareId": ...
// }
//
const newShareWrapper = async (req, res) => {
    const uuid = crypto.randomUUID();
    console.log(uuid);
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

        const result = await knex('disposible').insert({
            provider: req.body.provider,
            hashed_url: req.body.hashedUrl,
            link: uuid,
            calendar_date: req.body.date,
            city_slug: req.body.city
        })
            .then((result) => {
                res.status(200).json({ success: true, shareId: uuid });
            })
    } catch (error) {
        console.log('Error inserting link. ' + error);
        res.status(500).json({ success: false, error: 'Failed to generate link.' });
    }

}

const getCorrespondingLinkWrapper = async (req, res) => {
    const shareId = req.params.uuid;

    try {
        const dataOfFriend = await knex('disposible')
            .select('calendar_date', 'city_slug')
            .where('link', shareId);


        if (typeof dataOfFriend[0].calendar_date === 'undefined' || typeof dataOfFriend[0].city_slug === 'undefined') {
            res.status(500).json({ success: false, error: 'Failed to find corresponding link.' });
            return;
        }
        console.log(dataOfFriend);

        res.status(200).json({success: true, date: dataOfFriend[0].calendar_date, city: dataOfFriend[0].city_slug});

    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to find corresponding link.' });
    }
}




export default router;
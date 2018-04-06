import { Router as expressRouter } from 'express';
import {
    getStreetsNearPrimaryStreet,
    getStreets,
    getMembers,
    addStreet,
    leaveStreet,
    getStreetByPlaceId,
    changePrimaryStreet,
    getStreetAdmins,
    getSelectedStreet,
    getNearbyStreets,
    getAdmins,
    addAdmin,
    changeStreetPrivacy
} from '../controllers/street';

const router = expressRouter();

// GET
router.get('/getStreetsNearPrimaryStreet', getStreetsNearPrimaryStreet);
router.get('/getNearbyStreets', getNearbyStreets);
router.get('/getSelectedStreet', getSelectedStreet);
router.get('/getStreetByPlaceId', getStreetByPlaceId);
router.get('/getStreets', getStreets);
router.get('/getMembers', getMembers);
router.get('/getStreetAdmins', getStreetAdmins);
router.get('/getAdmins', getAdmins);
// POST
router.post('/addStreet', addStreet);
router.post('/changePrimaryStreet', changePrimaryStreet);
// DELETE
router.delete('/leaveStreet', leaveStreet);
// PUT
router.put('/addAdmin', addAdmin);
router.put('/changeStreetPrivacy', changeStreetPrivacy);

export default router;

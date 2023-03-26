// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import {Router} from 'express';
import {bands} from '../config/mongoCollections.js'
//import * as band_data from './bands.js'
import {ObjectId} from 'mongodb';
import * as albumData from '../data/albums.js';
import * as bandData from '../data/bands.js';


const router = Router();

router
  .route('/:bandId')
  .get(async (req, res) => {
    //code here for GET

    const  bandId  = req.params.bandId;
    //console.log("band id = ",req.params)
    // check if bandId is a valid ObjectId
  if (!ObjectId.isValid(bandId)) {
    console.log("here")
    return res.status(400).send('Invalid bandId');
  }

  //const bandCollection = await bands();
  const band = await albumData.get(bandId)
  console.log(" band in al = ",band)

  if (!band) {
    return res.status(404).send('Band not found');
  }

  //const albums = band.albums;

  // check if there are any albums for the specified band
  if (!band || band.length === 0) {
    return res.status(404).send('No albums found for band');
  }

  res.status(200).send(band);


  
  })
  .post(async (req, res) => {
    //code here for POST
    
    try {
      if(!req.params.bandId){
        return res.status(400).send('No id')
      }
      let band_get_id = await bandData.get(req.params.bandId);
    } catch(e) {
      return res.status(404).json({error:'Not found'})
    }
    let bands_data = req.body;


    try{
      let new_album = await albumData.create( 
      req.params.bandId, 
      bands_data.title, 
      bands_data.releaseDate, 
      bands_data.tracks, 
      bands_data.rating
    )
      }
    catch(e){
      res.status(500).json({ error: 'album could not be created.' });
    }
    try{

    let findBand = await bandData.get(req.params.bandId);
    res.status(200).json(findBand)
    }
  catch(e){
    res.status(404).json({ error: 'band not found' });
  }
  });

router
  .route('/album/:albumId')
  .get(async (req, res) => {
    //code here for GET
    //console.log('req  = ',req.params)
    /*try{
      let object_id = ObjectId(req.params._id)
      if(!ObjectId.isValid(object_id)){
        throw "not valid object id"
      }
    }catch(e){
      return res.status(400).json({error: e})
    }
    */

    
    try{
      const req_album = await albumData.get(req.params.albumId);
      res.status(200).json(req_album)
    }catch(e){
      res.status(404).json({error:'No album found'})
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE

    console.log("req params = ",req.params)
    /*try {
      if(!req.params.albumId){
        return res.status(400).json({error:'Not valid id'})
      }
      let object_id = ObjectId(req.params.albumId)
      if(!ObjectId.isValid(object_id)){
      return res.status(400).json({error:'Not valid object id'})
    }
    let album = await albumData.get(req.params.albumId);
    if(!album){
      return res.status(400).json({error:'No review id'})
    }
    */
  try{ 
      let removed_album = await albumData.remove(req.params.albumId);
      res.status(200).json({albumId:req.params.albumId, deleted:true})
    }
    catch (e){
      res.status(404).json({ error: 'Not found' });
    }
  });

  export default router;
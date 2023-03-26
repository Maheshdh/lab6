// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import {bands} from '../config/mongoCollections.js'
import * as band_data from '../data/bands.js'
import {ObjectId} from 'mongodb';
import {Router} from 'express';
import validation from '../validation.js';

//import {postData} from '../data/index.js';


const router = Router();

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET


    try{
      let all_bands = await band_data.getAll();
      let ans = {};
      let result = []
      for(let i=0; i<all_bands.length; i++){
        ans = {_id: all_bands[i]._id , name: all_bands[i].name}
        result.push(ans);
      }
      res.status(200).json(result)
    }catch(e){
      res.status(404).json({ error: 'Could not get bands' });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    
    const { name, genre, website, recordCompany, groupMembers, yearBandWasFormed } = req.body;
    

  if (!name || !genre || !website || !recordCompany || !groupMembers || yearBandWasFormed === undefined) {
    return res.status(400).json({ message: 'All fields must be present' });
  }

  if (typeof name !== 'string' || typeof website !== 'string' || typeof recordCompany !== 'string' || !name.trim() || !website.trim() || !recordCompany.trim()) {
    return res.status(400).json({ message: 'Name, website, and record company must be valid strings' });
  }

  if (!website.match(/^http:\/\/www\..+\.com$/)) {
    return res.status(400).json({ message: 'Website must start with http://www. and end with .com' });
  }

  if (!Array.isArray(genre) || !genre.every(g => typeof g === 'string' && g.trim())) {
    return res.status(400).json({ message: 'Genre must be an array of valid strings' });
  }

  if (!Array.isArray(groupMembers) || !groupMembers.every(m => typeof m === 'string' && m.trim())) {
    return res.status(400).json({ message: 'Group members must be an array of valid strings' });
  }

  if (typeof yearBandWasFormed !== 'number' || yearBandWasFormed < 1900 || yearBandWasFormed > 2023) {
    return res.status(400).json({ message: 'Year band was formed must be a number between 1900 and 2023' });
  }
  //const band_data = await bands();
try{
  const newBand =  await band_data.create(
    name,
    genre,
    website,
    recordCompany,
    groupMembers,
    yearBandWasFormed,
  )
  

  // Save newBand to your database here

  res.status(200).json(newBand);
}
catch(e){
  res.status(500).json({error : 'band could not be created'})

}

  });

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    try{

      let band_id = req.params.id;
      //console.log("band id = ",band_id)
      band_id = band_id.trim()
      if(!band_id || band_id.length === 0){
        return res.status(400).json({error: 'Not valid id'})
      }
      if(!ObjectId.isValid(band_id)){
        return res.status(400).json({error: 'Not valid object id'})
      }
        //const band_data = await bands();

        let required_band = await  band_data.get(band_id);
        console.log("required band ",required_band)
        res.status(200).json(required_band);
      }catch(e){
          res.status(404).json({error:'Band not found'})
      }
  })
  .delete(async (req, res) => {
    //code here for DELETE
/*    try{

      if(!req.params._id || req.params.id === 0){
        return res.status(400).json({error:'Error'})
      }
      let object_id = new ObjectId(req.params.id)
      if(!ObjectId.isValid(object_id)){
        return res.status(400).json({error: 'Not valid object id'})
      }

     // const band_data = await bands();

      let delete_band_info = await band_data.get(req.params.id)
      let delete_band = await band_data.remove(req.params.id)
      res.status(200).json({bandId:delete_band_info.id, deleted:true})
    }catch(e){
      res.status(404).json({error:'Movie not found'})
    }
  })
  */
  try {
    req.params.id = validation.checkId(req.params.id, 'Id URL Param');
  } catch (e) {
    return res.status(400).json({error: e});
  }
  try {
    console.log(" id = ",req.params.id)
    let deletedPost = await band_data.remove(req.params.id);
    res.status(200).json(deletedPost);
  } catch (e) {
    let status = e[0] ? e[0] : 500;
    let message = e[1] ? e[1] : 'Internal Server Error';
    res.status(status).json({error: message});
  }
})

  .put(async (req, res) => {
    //code here for PUT
    /*
    let band_put_data = req.body;
    const id = req.params._id;

  // Validate id parameter
  if (!ObjectId.isValid(id)) {
    return res.status(400).send('Invalid id parameter');
  }

  // Check if band exists
  const band_data = await bands();

  let band = await band_data.get(id);
  if (!band) {
    return res.status(404).send('Band not found');
  }

  // Validate request body
  const { name, genre, website, recordCompany, groupMembers, yearBandWasFormed } = req.body;

  if (!name || !genre || !website || !recordCompany || !groupMembers || !yearBandWasFormed) {
    return res.status(400).send('Missing required fields');
  }

  if (typeof name !== 'string' || name.trim().length === 0 ||
    typeof website !== 'string' || website.trim().length === 0 || !/^http:\/\/www\..+\.com$/.test(website) ||
    typeof recordCompany !== 'string' || recordCompany.trim().length === 0) {
    return res.status(400).send('Invalid fields');
  }

  if (!Array.isArray(genre) || genre.length === 0 ||
    !genre.every(g => typeof g === 'string' && g.trim().length > 0) ||
    !Array.isArray(groupMembers) || groupMembers.length === 0 ||
    !groupMembers.every(gm => typeof gm === 'string' && gm.trim().length > 0) ||
    typeof yearBandWasFormed !== 'number' || yearBandWasFormed < 1900 || yearBandWasFormed > new Date().getFullYear()) {
    return res.status(400).send('Invalid fields');
  }

  // Copy old albums and overallRating
  const oldAlbums = band.albums;
  const overallRating = band.overallRating;

  // Update band
  band.name = name;
  band.genre = genre;
  band.website = website;
  band.recordCompany = recordCompany;
  band.groupMembers = groupMembers;
  band.yearBandWasFormed = yearBandWasFormed;
  band.albums = oldAlbums;
  band.overallRating = overallRating;

  // Save updated band
  try {
    await band.save();
    return res.status(200).json(band);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server error');
  }

  */

  const updatedData = req.body;
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    /*try {
      req.params.id = validation.checkId(req.params.id, 'ID url param');
      updatedData.name = validation.checkString(updatedData.title, 'Title');
      updatedData.genre = validation.checkString(updatedData.body, 'Body');
      updatedData.posterId = validation.checkId(
        updatedData.posterId,
        'Poster ID'
      );
      if (updatedData.tags) {
        if (!Array.isArray(updatedData.tags)) {
          updatedData.tags = [];
        } else {
          updatedData.tags = validation.checkStringArray(
            updatedData.tags,
            'Tags'
          );
        }
      }
    } catch (e) {
      return res.status(400).json({error: e});
    }
*/
    try {
      //console.log(" name = ",req.body)
      const updatedPost = await band_data.update(
        req.params.id,
        req.body.name,
        req.body.genre,
        req.body.website,
        req.body.recordCompany,
        req.body.groupMembers,
        req.body.yearBandWasFormed
      );
      res.json(updatedPost);
    } catch (e) {
      let status = 500;
      let message = e[1] ? e[1] : 'Internal Server Error';
      res.status(status).json({error: message});
    }

  });

  export default router;

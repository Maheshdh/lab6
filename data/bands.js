// This data file should export all functions using the ES6 standard as shown in the lecture code
import {ObjectId} from 'mongodb';
import {bands} from '../config/mongoCollections.js'
import {validateArrayInput, validateYear, validateWebsiteString,validateNumberInput,validateStringInput}
from '../helpers.js'
import validation from '../validation.js';


const create = async (
  name,
  genre,
  website,
  recordCompany,
  groupMembers,
  yearBandWasFormed
) => {
  
  name = validation.checkString(name,'name');
  website = validation.checkString(website,'website');
  website = validation.validateWebsiteString(website);
  recordCompany = validation.checkString(recordCompany,'recordCompany');
  genre = validation.checkStringArray(genre,'genre');
  groupMembers = validation.checkStringArray(groupMembers,'groupMembers');
  yearBandWasFormed = validation.validateYear(yearBandWasFormed)

console.log("year = ",yearBandWasFormed)
  

  // If all validations pass, create and return the band object
  const new_band = {
    _id: new ObjectId(),
    name: name.trim(),
    genre: genre.map(g => g.trim()),
    website: website.trim(),
    recordCompany: recordCompany.trim(),
    groupMembers: groupMembers.map(m => m.trim()),
    yearBandWasFormed: yearBandWasFormed,
    albums: [],
    overallRating : 0
  };

  const bandCollection = await bands();
  const insertInfo = await bandCollection.insertOne(new_band);
  if (!insertInfo.acknowledged || !insertInfo.insertedId){
    throw 'Fail to create a new band';
  }

  const newBandId = insertInfo.insertedId.toString();
  const band = await get(newBandId);
  return band;
};

const getAll = async () => {

  const bandCollection = await bands();
    let bandList = await bandCollection.find({}).toArray();
    if (!bandList) throw 'Error while fetching all bands';

    if(bandList.length === 0){
      return [];
    }
    bandList = bandList.map((element) => {
      element._id = element._id.toString();
      return element;
    });
    return bandList;
};

const get = async (id) => {
id = validation.checkId(id);
const bandCollection = await bands();
const band = await bandCollection.findOne({_id: new ObjectId(id)});
if (band === null || !band || band === undefined) throw 'No band with input id exists';

band._id = band._id.toString();
return band;
};

const remove = async (id) => {

    id = validation.checkId(id);
    const bandCollection = await bands();
    const deletionInfo = await bandCollection.findOneAndDelete({
      _id: new ObjectId(id)
    });
    if (deletionInfo.lastErrorObject.n === 0)
      throw [404, `Could not delete post with id of ${id}`];
    return {...deletionInfo.value, deleted: true};

};

const update = async (
  id,
  name,
  genre,
  website,
  recordCompany,
  groupMembers,
  yearBandWasFormed
) => {

  

  id = validation.checkId(id);
  name = validation.checkString(name, 'name')
  website = validation.checkString(website, 'website')
  website = validation.validateWebsiteString(website)
  genre = validation.checkStringArray(genre, 'genre')
  groupMembers = validation.checkStringArray(groupMembers, 'groupMembers')
  yearBandWasFormed = validation.validateYear(yearBandWasFormed)
   let cur_band = await get(id)
   let oldAlbums = cur_band.albums;
   let oldRating = cur_band.overallRating;
   
    let updatedBandData = {
      name : name,
  genre : genre, 
  website : website,
  recordCompany : recordCompany,
  groupMembers : groupMembers,
  yearBandWasFormed : yearBandWasFormed,
  albums : oldAlbums,
  overallRating : oldRating

    };
    const bandCollection = await bands();
    const updateInfo = await bandCollection.findOneAndReplace(
      {_id: new ObjectId(id)},
      updatedBandData,
      {returnDocument: 'after'}
    );
    if (updateInfo.lastErrorObject.n === 0)
      throw [404, `Error: Update failed! Could not update band with id ${id}`];
    return updateInfo.value;


};


export {create,getAll,get,remove,update};

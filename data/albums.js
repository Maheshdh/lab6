// This data file should export all functions using the ES6 standard as shown in the lecture code
import {bands} from '../config/mongoCollections.js'

import * as band_data from './bands.js'
import {ObjectId} from 'mongodb';

const create = async (
  bandId,
  title,
  releaseDate,
  tracks,
  rating
) => {
  // Validate input
  /*
  if (!bandId || !title || !releaseDate || !tracks || rating == null) {
    throw new Error('Missing required input');
  }
  if (typeof bandId !== 'string' || !bandId.trim() ||
      typeof title !== 'string' || !title.trim() ||
      typeof releaseDate !== 'string' || !releaseDate.trim()) {
    throw new Error('Invalid input type');
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    throw new Error('Invalid rating');
  }
  if (!Array.isArray(tracks) || tracks.length < 3 ||
      !tracks.every(track => typeof track === 'string' && track.trim())) {
    throw new Error('Invalid tracks');
  } 
*/
bandId = validation.checkString(bandId,'bandId');
title = validation.checkString(title,'title');
releaseDate = validation.checkString(releaseDate,'releaseDate');
bandId = validation.checkId(bandId);
tracks = validation.checkStringArray(tracks, 'tracks')
if(tracks.length<3){
  throw "The Tracks array should have at least 3 tracks "
}



  const bandCollection = await bands();
  const movie = await bandCollection.findOne({_id: new ObjectId(bandId)});


  const band = await band_data.get(bandId);
  if (!movie) {
    throw new Error('Band not found');
  }

  // Validate release date
  const releaseDateParts = releaseDate.split('/');
  if (releaseDateParts.length !== 3) {
    throw new Error('Invalid release date');
  }
  const month = parseInt(releaseDateParts[0]);
  const day = parseInt(releaseDateParts[1]);
  const year = parseInt(releaseDateParts[2]);
  const isValidDate = !isNaN(month) && !isNaN(day) && !isNaN(year) &&
    month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 &&
    year <= new Date().getFullYear() + 1;
  if (!isValidDate) {
    throw new Error('Invalid release date');
  }

  // Create album
  const album = {
    _id: new ObjectId(),
    title: title.trim(),
    releaseDate: releaseDate.trim(),
    tracks: tracks.map(track => track.trim()),
    rating: parseFloat(rating.toFixed(1))
  };
  movie.albums.push(album);
  const newOverallRating = recalculateBandRating(movie._id);

  const updatedInfo = await bandCollection.updateOne(
    { _id: new ObjectId(bandId) },
    {
        $push: { albums: album }  ,
        $set: { overallRating: newOverallRating },
      }
  );
  if(updatedInfo.modifiedCount=== 0) throw "Could not add review";

  
  return album;

};
const avaerage_ratings_movie = (reviews) => {
  let deno = 0;
  let sum = 0;

  for (let i of reviews) {
      sum += i.rating;
      deno++;
  }
  let avg = sum/deno
  return Number(avg.toFixed(1));
};


const getAll = async (bandId) => {
  /*if (!bandId) {
    throw new Error('bandId must be provided');
  }

  if (typeof bandId !== 'string' || bandId.trim().length === 0) {
    throw new Error('bandId must be a non-empty string');
  }

  let objectId;
  try {
    objectId = new ObjectId(bandId);
  } catch (err) {
    throw new Error('bandId must be a valid ObjectId');
  }
  */
  const bandCollection = await bands();

  const band = await bandCollection.findOne({_id: new ObjectId(bandId)});
  if (!band) {
    throw new Error('band with the given bandId does not exist');
  }

  const albums = band.albums || [];
  return JSON.parse(JSON.stringify(albums));


  //return albums;
};

const get = async (albumId) => {
/*  if (!albumId) {
    throw new Error('albumId must be provided');
  }

  if (typeof albumId !== 'string' || albumId.trim().length === 0) {
    throw new Error('albumId must be a non-empty string');
  }

  let objectId;
  /*try {
    objectId = new ObjectId(albumId);
  } catch (err) {
    throw new Error('albumId must be a valid ObjectId');
  }
  //const bandCollection = await bands();
*/
  //const review = await bandCollection.findOne({'albums._id' : new ObjectId(albumId)},{projection:{_id:0,"albums.$":1}});
  let review = await band_data.getAll()
//  console.log("review = ",review)

  if(!review) throw "No band found with this particular id."
  //console.log("review = ",review)
  for(let i = 0;i<review.length;i++){
  let r = review[i].albums;
  console.log("cur albums = ",r)
  for(let j=0;j<r.length;j++){
    console.log(" id = ",r[j]._id.toString())
    console.log(" alid = ",albumId)

  if(r[j]._id.toString() === albumId){
    console.log(r[j])

    return JSON.parse(JSON.stringify(r[j]))
  }
}
  }

throw "No album found with this particular id."
  //return album;
};

const remove = async (albumId) => {
  /*if(!albumId){
    throw 'No id';
  }
  if(typeof albumId !== 'string') throw 'Not string datatype';
  if(albumId.trim().length==0) throw 'length should not be zero'
  //objid = ObjectId(reviewId);
  if (!ObjectId.isValid(albumId)){
    throw 'Not a valid object id'
  }
  let parsedAlbumId;
  try {
    parsedAlbumId = new ObjectId(albumId);
  } catch {
    throw new Error('albumId is not a valid ObjectId');
  }
*/
    let parsedAlbumId = new ObjectId(albumId);
  /*const bandCollection = await bands();
  const band = await bandCollection.findOneAndUpdate(
    { 'albums._id': parsedAlbumId },
    { $pull: { albums: { _id: parsedAlbumId } } },
    { returnOriginal: true }
  );

  if (!band) {
    throw new Error(`No band found with albumId: ${albumId}`);
  }
 // console.log("band ",band.value)
  const newOverallRating = avaerage_ratings_movie(band.value.albums);
  console.log(" new rating ",newOverallRating)
  const updatedInfo = await bandCollection.updateOne(
    { _id: new ObjectId(band.value._id) },
    {
        $set: { overallRating: newOverallRating },
      }
  );
  */
  // Find the band that contains the album with the given albumId
  let band_collection = await bands()
  const band = await band_collection.findOne({ 'albums._id': parsedAlbumId });

  // Throw an error if the album doesn't exist with the given albumId
  if (!band || !band.albums.some((album) => album._id.equals(parsedAlbumId))) {
    throw new Error('Album not found');
  }

  // Remove the album with the given albumId from the band's albums array
  const result = await band_collection.updateOne(
    { _id: band._id },
    { $pull: { albums: { _id: parsedAlbumId } } }
    //{returnDocument: 'after'}

  );

  console.log("updated band  = ",await band_data.get(band._id.toString()).stringify)

  // Throw an error if the update operation did not remove any albums
  if (result.modifiedCount === 0) {
    throw new Error('Album not found');
  }

  // Recalculate the overallRating of the band by averaging the ratings of all its albums
  const bandWithUpdatedRating = await recalculateBandRating(band._id);

  

  return band_data.get(band._id.toString());
};

async function recalculateBandRating(bandId) {
  let band_collection = await bands();
  const band = await band_collection.findOne({ _id: bandId });

  let totalRating = 0;
  let numAlbums = 0;

  // Loop through all the band's albums and sum up their ratings
  for (const album of band.albums) {
    if (album.rating) {
      totalRating += album.rating;
      numAlbums++;
    }
  }

  // Calculate the average rating and update the overallRating field of the band
  const averageRating = numAlbums > 0 ? totalRating / numAlbums : 0;
  await band_collection.updateOne(
    { _id: bandId },
    { $set: { overallRating: averageRating } }
  );

  return band;
}

export {create,getAll,get,remove};


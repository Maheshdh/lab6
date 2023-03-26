// This file will import both route files and export the constructor method as shown in the lecture code

/*
    - When the route is /bands use the routes defined in the bands.js routing file
    - When the route is /albums use the routes defined in albums.js routing file
    - All other enpoints should respond with a 404 as shown in the lecture code
*/
import  band_routes from './bands.js';
import   album_Routes from './albums.js';

const constructorMethod = (app) => {
    app.use("/bands", band_routes);
    app.use("/albums", album_Routes);

    //for accessing unknown routes
    app.use("*", (request, response) => {
        response.status(404).json({ serverResponse: "Not found." });
    });

    
};

export default constructorMethod;
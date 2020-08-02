const { catchErrors } = require('../controllers/errorHandlers')

module.exports = app => {
  const allControllers = require("../controllers/controller.js");
  var router = require("express").Router();
  
  // Retrieve all projects to db recursively (projects -> workbooks -> views)
  router.get("/projects", catchErrors(allControllers.getAllProjects));
  
  // Sign in to tableau account
  router.post("/signin", catchErrors(allControllers.signIn));
  
  // finds all assets by query, the search is from db
  router.get("/findByKeyword", catchErrors(allControllers.findAssetsByKeyword));
  
  // finds all assets by query, the search is from db
  router.get("/assets", catchErrors(allControllers.getAllAssets));

  app.use('/rupert/tableau', router);
};
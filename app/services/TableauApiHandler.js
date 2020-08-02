const axios = require('axios').default;
const db = require("../models");
const Workbook = db.workbooks;

const TableauDbHandler = require("../services/TableauDbHandler");
const HttpBuilder = require('./HttpRequestBuilder');

var token = "";
var siteId = "";

async function signIn(req, res) {
  const xmlBodyStr = HttpBuilder.getTableauSignInBody(
    req.body.user, req.body.password, req.body.siteName);

  const response = await axios.post(
    HttpBuilder.getTableauSignInUrl(),
    xmlBodyStr,
    HttpBuilder.getTableauHeader());
  console.log(response);

  if (response.status == 200) {
    token = response.data.credentials.token;
    siteId = response.data.credentials.site.id;
    res.status(200).send({ message: "Signed in to tableau account" });
  } else {
    res.status(response.status).send({ message: response.status.statusText });
  }
}

async function getProjects(req, res){
  const response = await axios.get(HttpBuilder.getProjectsUrl(siteId),
    HttpBuilder.getTableauHeader(token))
    .catch(function (error) {
      console.log("Failed to get tableu projects");
      throw error;
    });

  const updatedIds = await TableauDbHandler.updateProjects(response.data.projects);

  // TODO: should update only for each project from updatedIds
  await retriveWorkbooks();

  res.send({ projects : response.data.projects.project,
              updated : updatedIds });
}

async function retriveViewsForWorkbooks(workbooksIds) {
  for (var workbookId of workbooksIds) {
    const response = await axios.get(
      HttpBuilder.getViewsUrl(siteId, workbookId),
      HttpBuilder.getTableauHeader(token));
    
    for (var currentView of response.data.views.view) {
      const dataOfCurrentView = await axios.get(
        HttpBuilder.getViewDataUrl(siteId, currentView.id),
        HttpBuilder.getTableauHeader(token));
      await TableauDbHandler.upsertView(currentView.id,
        currentView.name, workbookId, currentView.projectId, dataOfCurrentView.data,
        currentView.updatedAt);     
    } // for viewa
  } // for workbooks
}

async function retriveWorkbooks(){
  const response = await axios.get(
    HttpBuilder.getWorkbooksUrl(siteId),
    HttpBuilder.getTableauHeader(token));
  console.log(response);

  var updatedIds = [];
  for(var currentWorkbook of response.data.workbooks.workbook) {
    const data = await Workbook.findById(currentWorkbook.id);
    if (data == null) {
      // woerkbook does not exist in our db, add it
      const newWorkbook = new Workbook(
        { _id: currentWorkbook.id,
          name: currentWorkbook.name });
        await newWorkbook.save(newWorkbook);
        updatedIds.push(currentWorkbook.id);
    } else {
      if(data.updatedAt < currentWorkbook.updatedAt) {
        await Workbook.findOneAndUpdate(
          {_id : currentWorkbook.id }, 
          { updatedAt : currentWorkbook.updatedAt});
          updatedIds.push(currentWorkbook.id);
      }
    }
  } // for

  await retriveViewsForWorkbooks(updatedIds);
} // retriveWorkbooks

  module.exports.signIn = signIn;
  module.exports.getProjects = getProjects;

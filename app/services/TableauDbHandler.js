/* Database handler for tableau assets */
const db = require("../models");
const Project = db.projects;
const Workbook = db.workbooks;
const View = db.views;

async function getAllProjects () {
    var docs = await Project.find();
    return docs.map(value => value._id);
}

/* finds all views that containts the string toFind
 * returns the ids of the relevant views */
async function findAllViews (toFind) {
    var docs = await View.find({
        $or: [{ data: { $regex: new RegExp(toFind), $options: "i" } },
        { name: { $regex: new RegExp(toFind), $options: "i" } }]
    });

    return docs.map(value => value._id);
}

/* finds all workbooks that containts the string toFind in their name
 * returns the ids of the relevant views */
async function findAllWorkbooks(toFind) {
    var docs = await Workbook.find(
        { name: { $regex: new RegExp(toFind), $options: "i" } });
    return docs.map(value => value._id);
};

/* Update projects from input list if they are not updated in db
 * returns updated projects ids */
async function updateProjects(projects) {
    var updatedIds = [];
    for (var currentProj of projects.project) {
      const data = await Project.findById(currentProj.id);
      if (!data ||
        (data.lastUpdateFromTableauServer.getTime() < new Date(currentProj.updatedAt).getTime())) {
        const newProj = new Project({
          _id: currentProj.id,
          lastUpdateFromTableauServer: currentProj.updatedAt
        });
          
        await Project.updateOne({ _id: currentProj.id }, newProj, { upsert: true });
      }
    }

    return updatedIds;
};

/* Updates view or insert if not exist */
async function upsertView(id, name, workbookId, projectId, data, lastUpdateFromTableauServer) {
    const newView = new View(
        {
            _id: id,
            name: name,
            workbookId: workbookId,
            projectId: projectId,
            data: data,
            lastUpdateFromTableauServer: lastUpdateFromTableauServer,
        });
    await View.updateOne({ _id: id }, newView, { upsert: true });
};

module.exports.getAllProjects = getAllProjects;
module.exports.findAllViews = findAllViews;
module.exports.findAllWorkbooks = findAllWorkbooks;
module.exports.updateProjects = updateProjects;
module.exports.upsertView = upsertView;

const tableauApiHandler = require("../services/TableauApiHandler");
const TableauDbHandler = require("../services/TableauDbHandler")

exports.getAllProjects = async (req, res) => {
  return tableauApiHandler.getProjects(req, res);
};

exports.signIn = async (req, res) => {

  return tableauApiHandler.signIn(req, res).then(value => {
    console.log("Signed In");
  });
};

exports.findAssetsByKeyword = async (req, res) => {
  const relevantViews = await TableauDbHandler.findAllViews(req.query.toFind);
  const relevantWorkbooks = await TableauDbHandler.findAllWorkbooks(req.query.toFind);

  res.send({
    viewsCount: relevantViews.length,
    viewsId: relevantViews,
    workbooksCount: relevantWorkbooks.length,
    workbooksId: relevantWorkbooks
  });
};

exports.getAllAssets = async (req, res) => {
  const allViews = await TableauDbHandler.findAllViews();
  const allWorkbooks = await TableauDbHandler.findAllWorkbooks();
  const allProjects = await TableauDbHandler.getAllProjects();

    res.send({
      projectsCount: allProjects.length,
      projectsId: allProjects,
    workbooksCount: allWorkbooks.length,
    workbooksId: allWorkbooks,
    viewsCount: allViews.length,
    viewsId: allViews
  });
};

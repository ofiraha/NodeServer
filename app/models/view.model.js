
module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        _id: String,
        name: String,
        workbookId: String,
        projectId: String,
        data: String,
        lastUpdateFromTableauServer: Date
      },
      { timestamps: true }
    );
  
    const View = mongoose.model("View", schema);
    return View;
  };
/* for each tableau project, saves it with its original id and last 
update time in my server db */

module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        _id: String,
        lastUpdateFromTableauServer: Date
      },
      { timestamps: true }
    );
  
    const Project = mongoose.model("Project", schema);
    return Project;
  };
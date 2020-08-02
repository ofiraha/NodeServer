/* for each workbook in project, saves name, id and last update time*/

module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        _id: String,
        name: String,
      },
      { timestamps: true }
    );
  
    const Workbook = mongoose.model("Workbook", schema);
    return Workbook;
  };
export function crudController(Model, populate = "") {
  return {
    list: async (req, res) => {
      const docs = await Model.find().populate(populate).sort({ createdAt: -1 });
      res.json(docs);
    },
    get: async (req, res) => {
      const doc = await Model.findById(req.params.id).populate(populate);
      if (!doc) return res.status(404).json({ message: "Record not found" });
      res.json(doc);
    },
    create: async (req, res) => {
      const doc = await Model.create(req.body);
      res.status(201).json(doc);
    },
    update: async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!doc) return res.status(404).json({ message: "Record not found" });
      res.json(doc);
    },
    remove: async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Record not found" });
      res.json({ message: "Deleted successfully" });
    }
  };
}

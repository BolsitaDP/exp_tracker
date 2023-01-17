const model = require("../models/model");

// post: http://localhost:8080/api/categories
const create_categories = async (req, res) => {
  const Create = new model.Categories({
    type: "Investment",
    color: "#FCBE44",
  });

  await Create.save((err) => {
    if (!err) return res.json(Create);
    return res
      .status(400)
      .json({ message: `Error while creating categories ${err}` });
  });
};

// get: http://localhost:8080/api/categories
const get_Categories = async (req, res) => {
  let data = await model.Categories.find({});

  let filter = await data.map((v) =>
    Object.assign({}, { type: v.type, color: v.color })
  );
  return res.json(filter);
};

// post: http://localhost:8080/api/transaction
const create_Transaction = async (req, res) => {
  if (!req.body) return res.status(400).json("Post HTTP Data not provided");
  let { name, type, amount } = req.body;

  const create = await new model.Transaction({
    name,
    type,
    amount,
    date: new Date(),
  });

  create.save((err) => {
    if (!err) return res.json(create);
    return res
      .status(400)
      .json({ message: `Error while creating Transaction ${err}` });
  });
};

// get: http://localhost:8080/api/transaction
const get_Transaction = async (req, res) => {
  let data = await model.Transaction.find({});
  return res.json(data);
};

// delete: http://localhost:8080/api/transaction
const delete_Transaction = async (req, res) => {
  if (!req.body) res.status(400).json({ message: "Reques body not found" });
  await model.Transaction.deleteOne(req.body, (err) => {
    if (!err) res.json("Record Deleted");
  })
    .clone()
    .catch((err) => {
      res.json("Error while deleting Transaction record");
    });
};

// get: http://localhost:8080/api/labels
const get_Labels = async (req, res) => {
  model.Transaction.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "type",
        foreignField: "type",
        as: "categories_info",
      },
    },
    {
      $unwind: "$categories_info",
    },
  ])
    .then((result) => {
      let data = result.map((v) =>
        Object.assign(
          {},
          {
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.categories_info["color"],
          }
        )
      );
      res.json(data);
    })
    .catch((error) => {
      res.status(400).json(`Lookup Collection Error: ${error}`);
    });
};

module.exports = {
  create_categories,
  get_Categories,
  create_Transaction,
  get_Transaction,
  delete_Transaction,
  get_Labels,
};

const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
function dishExists(req, res, next) {
  const dishId = req.params.dishId;
  const foundDish = dishes.filter((dish) => dish.id === dishId);
  if (foundDish.length > 0) {
    res.locals.dish = foundDish;
    next();
  } else {
    next({ status: 404, message: `Dish ${dishId} not found.` });
  }
}

function isIdValid(req, res, next) {
  let {
    data: { id },
  } = req.body;
  const dishId = req.params.dishId;
  if (
    req.body.data.id === null ||
    req.body.data.id === "" ||
    req.body.data.id === undefined
  ) {
    return next();
  }
  if (req.body.data.id !== dishId) {
    next({
      status: 400,
      message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
    });
  } else {
    next();
  }
}

function isNameValid(req, res, next) {
  const { data: name } = req.body;
  if (
    req.body.data.name === null ||
    req.body.data.name === "" ||
    req.body.data.name === undefined
  ) {
    next({ status: 400, message: "Dish must include a name." });
  }
  next();
}

function isDescriptionValid(req, res, next) {
  const { data: description } = req.body;
  if (
    req.body.data.description === null ||
    req.body.data.description === "" ||
    req.body.data.description === undefined
  ) {
    next({ status: 400, message: "Dish must include a description." });
  }
  next();
}

function isPriceValid(req, res, next) {
  const { data: price } = req.body;
  if (
    req.body.data.price === null ||
    req.body.data.price === "" ||
    req.body.data.price === undefined
  ) {
    next({ status: 400, message: "Dish must include a price." });
  }
  if (typeof req.body.data.price === "number" && req.body.data.price > 0) {
    return next();
  } else {
    next({
      status: 400,
      message: "The price must be a number greater than zero.",
    });
  }
}

function isImageUrlValid(req, res, next) {
  const { data: image_url } = req.body;
  if (
    req.body.data.image_url === null ||
    req.body.data.image_url === "" ||
    req.body.data.image_url === undefined
  ) {
    next({ status: 400, message: "Dish must include an image_url." });
  }
  next();
}

function create(req, res) {
  const { 
    data: { id, name, description, price, image_url } 
  } = req.body;
  const newId = nextId();
  const newName = req.body.data.name;
  const newDescription = req.body.data.description;
  const newPrice = req.body.data.price;
  const newImageUrl = req.body.data.image_url;
  const newDish = {
    id: newId,
    name: newName,
    description: newDescription,
    price: newPrice,
    image_url: newImageUrl
  };

  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

function read(req, res, next) {
  const foundDish = res.locals.dish;
  if (foundDish) {
    res.json({ data: foundDish[0] });
  }
}

function update(req, res) {
  const dishId = req.params.dishId;
  let {
    data: { name, description, price, image_url }
  } = req.body;
  let updatedDish = {
    id: dishId,
    name: req.body.data.name,
    description: req.body.data.description,
    price: req.body.data.price,
    image_url: req.body.data.image_url
  };
  return res.json({ data: updatedDish });
}

function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
  create: [isNameValid, isDescriptionValid, isPriceValid, isImageUrlValid, create],
  read: [dishExists, read],
  update: [
    dishExists,
    isNameValid,
    isDescriptionValid,
    isPriceValid,
    isImageUrlValid,
    isIdValid,
    update
  ],
  list
}
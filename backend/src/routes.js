const express = require("express");
const routes = express.Router();
const DevController = require("./control/DevController");
const LikeController = require("./control/LikeController");
const DislikeController = require("./control/DislikeController");

routes.get("/devs", DevController.index);

routes.post("/devs", DevController.store);
routes.post("/devs/:devId/likes", LikeController.store);
routes.post("/devs/:devId/dislikes", LikeController.store);

module.exports = routes;
const express = require("express");
const adminMiddleware = require("../middleware/adminMiddleware");
const problemRouter = express.Router();
const { createProblem, updateProblem, deleteProblem, getProblemById, getAllProblem, solvedAllProblembyUser, submittedProblem } = require("../controllers/userProblem");
const userMiddleware = require("../middleware/userMiddleware");


//create the problem
problemRouter.post("/create", adminMiddleware, createProblem);
problemRouter.put("/update/:id", adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id", adminMiddleware, deleteProblem);


problemRouter.get("/problemById/:id", userMiddleware, getProblemById);
problemRouter.get("/getAllProblems", userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedByUser", userMiddleware, solvedAllProblembyUser);
problemRouter.get("/submittedProblem/:pid", userMiddleware, submittedProblem);
module.exports = problemRouter;
//fetch the problem
//update the problem
//delete the problem
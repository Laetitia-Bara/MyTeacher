const express = require("express");
const Ressource = require("../models/ressources");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const { checkBody } = require("../modules/checkBody");
const router = express.Router();

// Get all ressources of a teacher
router.get(
  "/getRessources",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    const teacherId = req.user.userId;
    try {
      const ressources = await Ressource.find({ teacherId });
      res.json({ result: true, ressources });
    } catch (error) {
      console.log("Error", error);
      res
        .status(500)
        .json({ result: false, error: "Error fetching ressources" });
    }
  },
);

// Add a ressource
router.post(
  "/add",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    try {
      if (!checkBody(req.body, ["title", "tag", "url"])) {
        res.status(400).json({ result: false, error: "Missing fields" });
        return;
      }
    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ result: false, error: "Error with inputs" });
    }
    const teacherId = req.user.userId;
    const { title, tag, url } = req.body;
    try {
      const newRessource = await Ressource.create({
        teacherId,
        title,
        type: "file",
        url,
        tags: tag,
      });

      res.json({ result: true, newRessource });
    } catch (error) {
      console.log("Error", error);
      res
        .status(500)
        .json({ result: false, error: "Error creating ressource" });
      return;
    }
  },
);

// Add doc on cloudinary and get url back
router.post(
  "/upload",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {},
);

// Share a ressource
router.post(
  "/share",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    try {
      if (!checkBody(req.body, ["ressources", "students"])) {
        res
          .status(400)
          .json({ result: false, error: "Missing fields for sharing" });
        return;
      }
    } catch (error) {
      console.log("Error", error);
      res
        .status(500)
        .json({ result: false, error: "Error with inputs for sharing" });
    }

    const { ressources, students } = req.body;

    try {
      for (let obj of ressources) {
        let ressourceCheck = await Ressource.findById(obj._id);
        if (!ressourceCheck) {
          res.status(404).json({ result: false, error: "Ressource not found" });
          return;
        } else {
          console.log(ressourceCheck);
          res.json({ result: true, ressource: ressourceCheck });
        }
        // let ressourceDatabase = await Ressource.updateOne({ _id: obj._id },  {studentId: students} );
      }
    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ result: false, error: "Error for sharing" });
    }
  },
);

// Download a ressource
router.get(
  "/download/:id",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {},
);

// Delete a ressource
router.delete(
  "/deleteRessource/:id",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    try {
      const deletedRessource = await Ressource.findByIdAndDelete(req.params.id);
      if (deletedRessource) {
        res.json({ result: true });
      } else {
        res.json({ result: false, error: "Ressource not found" });
      }
    } catch (error) {
      console.log("Error", error);
      res
        .status(500)
        .json({ result: false, error: "Error deleting ressource" });
    }
  },
);

module.exports = router;

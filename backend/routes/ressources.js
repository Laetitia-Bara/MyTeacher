const express = require("express");
const Ressource = require("../models/ressources");
const authMiddleware = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const { checkBody } = require("../modules/checkBody");
const router = express.Router();

// Get all ressources of a teacher
router.get("/", authMiddleware, requireRole("teacher"), async (req, res) => {});

// Add a ressource
router.post(
  "/add",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {
    if (!checkBody(req.body, ["title", "type", "url"])) {
      res.json({ result: false, error: "Missing fields" });
      return;
    }

    res.json({ result: "OK" });
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
  async (req, res) => {},
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
  "/delete/:id",
  authMiddleware,
  requireRole("teacher"),
  async (req, res) => {},
);

module.exports = router;

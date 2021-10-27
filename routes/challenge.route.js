const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challenge.controller');


router.get("/", challengeController.getChallenge);
router.post("/", challengeController.postChallenge);
router.put("/:id", challengeController.updateChallenge);
router.delete("/:id", challengeController.deleteChallenge);
module.exports = router;
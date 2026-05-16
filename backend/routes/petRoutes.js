const express = require('express');
const multer = require('multer');
const path = require('path');
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Multer storage for pet images and reports
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// All routes are protected
router.use(authMiddleware.protect);

router.route('/')
  .get(petController.getAllPets)
  .post(upload.single('image'), petController.createPet);

router.route('/:id')
  .get(petController.getPet)
  .patch(upload.single('image'), petController.updatePet)
  .delete(petController.deletePet);

router.post('/:id/reports', upload.single('report'), petController.uploadReport);
router.get('/:id/ai-report', petController.generateHealthReport);

module.exports = router;

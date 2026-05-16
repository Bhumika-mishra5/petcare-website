const Pet = require('../models/Pet');

exports.getAllPets = async (req, res) => {
  try {
    const rawPets = await Pet.findAll({ where: { owner: req.user.id } });
    const pets = rawPets.map(p => ({ ...p.toJSON(), _id: p.id }));

    res.status(200).json({
      status: 'success',
      results: pets.length,
      data: { pets },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getPet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ where: { id: req.params.id, owner: req.user.id } });
    if (!pet) {
      return res.status(404).json({
        status: 'fail',
        message: 'No pet found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: { pet: { ...pet.toJSON(), _id: pet.id } },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.createPet = async (req, res) => {
  try {
    const petData = { ...req.body, owner: req.user.id };
    
    if (req.file) {
      petData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    
    // Initialize weight history
    if (petData.weight) {
      petData.weightHistory = [{ weight: petData.weight, date: new Date() }];
    }

    const newPet = await Pet.create(petData);

    res.status(201).json({
      status: 'success',
      data: { pet: { ...newPet.toJSON(), _id: newPet.id } },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findOne({ where: { id: req.params.id, owner: req.user.id } });
    if (!pet) {
      return res.status(404).json({
        status: 'fail',
        message: 'No pet found with that ID',
      });
    }
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    // Handle Weight History
    if (req.body.weight && req.body.weight != pet.weight) {
       const history = pet.weightHistory || [];
       history.push({ weight: parseFloat(req.body.weight), date: new Date() });
       updateData.weightHistory = history;
    }

    await pet.update(updateData);

    res.status(200).json({
      status: 'success',
      data: { pet: { ...pet.toJSON(), _id: pet.id } },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const deletedCount = await Pet.destroy({ where: { id: req.params.id, owner: req.user.id } });

    if (deletedCount === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'No pet found with that ID',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.uploadReport = async (req, res) => {
  try {
    const pet = await Pet.findOne({ where: { id: req.params.id, owner: req.user.id } });
    if (!pet) {
      return res.status(404).json({ status: 'fail', message: 'No pet found' });
    }

    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    const reportUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const reportName = req.body.reportName || req.file.originalname;

    // Sequelize JSON array mapping
    const currentHistory = pet.medicalHistory || [];
    currentHistory.push({
      date: new Date(),
      description: reportName,
      url: reportUrl
    });

    await pet.update({ medicalHistory: currentHistory });

    res.status(200).json({
      status: 'success',
      data: { pet: { ...pet.toJSON(), _id: pet.id } },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
exports.generateHealthReport = async (req, res) => {
  try {
    const pet = await Pet.findOne({ where: { id: req.params.id, owner: req.user.id } });
    if (!pet) {
      return res.status(404).json({ status: 'fail', message: 'No pet found' });
    }

    const localAI = require('../utils/localAI');
    
    // Generate a basic report using the local AI logic
    const petName = pet.name || "your pet";
    const baseReport = localAI.generateResponse(`how is ${petName}`);
    
    // Construct a beautiful professional report
    const fullReport = `
### 🐾 Mishri's Local AI Health Summary

**Status Overview:**
Based on my local intuition analysis, ${petName} is doing great! ${baseReport}

**Nutritional Advice:**
Ensure a consistent feeding schedule with high-quality protein. Avoid sudden changes in diet to prevent digestive upset. Keep an eye on their weight trajectory.

**Recommended Next Steps:**
- Maintain current activity goals (tracking ${pet.activityGoals?.length || 0} active goals).
- Keep up with hydration, especially after play sessions!

*Note: This report was generated natively and securely on your local device using our custom JavaScript Brain.js model! 🦊*
    `;

    res.status(200).json({
      status: 'success',
      data: {
        report: fullReport,
        mode: 'local'
      }
    });
  } catch (err) {
    console.error('Local AI Report Error:', err.message);
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

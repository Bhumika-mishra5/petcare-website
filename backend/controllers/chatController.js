const fs = require('fs');
const path = require('path');
const Pet = require('../models/Pet');
const localAI = require('../utils/localAI');

exports.chat = async (req, res) => {
  try {
    const { message, history } = req.body;
    let fileData = null;

    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
      // We aren't doing vision locally for now, just note the upload
      fileData = true;
    }

    // Fetch user's pet context
    let userPets = [];
    if (req.user) {
       userPets = await Pet.findAll({ where: { owner: req.user.id } });
    }
    
    // Use the brain.js local AI model!
    let aiResponse = localAI.generateResponse(message || "hello");
    
    // Add specific pet context if the user asks about their pet
    if ((message.toLowerCase().includes("my pet") || message.toLowerCase().includes("my dog") || message.toLowerCase().includes("my cat")) && userPets.length > 0) {
       aiResponse = `According to my records, you have ${userPets.length} pet(s) registered! ${aiResponse}`;
    }

    if (fileData) {
      aiResponse = `I see you've uploaded a file! While my local vision processors are resting, my foxy intuition says everything will be okay. 🦊`;
    }

    return res.status(200).json({
      success: true,
      message: aiResponse,
    });

  } catch (error) {
    console.error('Local AI Chat Error:', error.message || error);
    res.status(500).json({
      success: false,
      message: "Mishri is taking a nap. Please try again later! 🦊",
      mode: 'fallback'
    });
  }
};


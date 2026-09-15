const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); 
require('dotenv').config();

const Resume = require('./models/Resume');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.log('⚠️ MongoDB Error:', err.message));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. AI Route (Fixed with Exact 3.5 Model)
app.post('/api/enhance', async (req, res) => {
  const { summary, education, skills, projects, interests, certifications, experience } = req.body;
  
  const prompt = `Act as an expert resume builder AI. Expand these keywords into a professional format.
  RULES: Do not use markdown like **. Plain text only.
  USER INPUTS:
  Summary: "${summary || 'seeking job'}"
  Education: "${education || 'N/A'}"
  Skills: "${skills || 'N/A'}"
  Projects: "${projects || 'N/A'}"
  Interests: "${interests || 'N/A'}"
  Certifications: "${certifications || 'N/A'}"
  Experience: "${experience || 'N/A'}"

  RETURN EXACTLY IN THIS FORMAT:
  [SUMMARY_START]
  expanded summary here
  [SUMMARY_END]
  [EDUCATION_START]
  expanded education here
  [EDUCATION_END]
  [SKILLS_START]
  expanded skills here
  [SKILLS_END]
  [PROJECTS_START]
  expanded projects here
  [PROJECTS_END]
  [INTERESTS_START]
  expanded interests here
  [INTERESTS_END]
  [CERTIFICATIONS_START]
  expanded certifications here
  [CERTIFICATIONS_END]
  [EXPERIENCE_START]
  expanded experience here
  [EXPERIENCE_END]`;

  try {
    // 🔥 EXACT FIX: Using the exact model Google asked us to use!
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    res.json({ success: true, aiText: text });
  } catch (error) {
    console.log("❌ GOOGLE AI ERROR:", error.message);
    res.status(500).json({ success: false, message: `Google AI Error: ${error.message}` });
  }
});

// 3. Save Resume Route
app.post('/api/save-resume', async (req, res) => {
  try {
    const newResume = new Resume(req.body);
    await newResume.save();
    res.json({ success: true, message: '✅ Resume Saved to Database!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
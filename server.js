const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();

// Enable CORS for all origins
app.use(cors());

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "public/images")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// In-memory projects data
let projects = [
  // initial sample data
  {
    _id: "8f298c04-00ed-42bc-b8f7-eaf3ec6ce5df",
    name: "DaVinci Academia",
    image: "images/Davinci.png",
    desc: "DaVinci Academia is a recreation of a University Course and Major review system...",
    skills: ["Java", "JSON", "Unit Testing"],
    contributions: [
      { url: "https://github.com/Shreklord", name: "Anthony Goldhammer" },
      { url: "https://github.com/olliekod", name: "Oliver Meihls" },
      { url: "https://github.com/sphilips04", name: "Spencer Philips" },
    ],
  },
  {
    _id: "31655518-db2b-4727-bbaa-bf06c78417cb",
    name: "PostOne",
    image: "images/PostOne.GIF",
    desc: "PostOne is a Smart Mailbox attachment created at 2025 CUHackit Hackathon...",
    skills: ["Python", "AWS", "Lambda Functions"],
    contributions: [{ name: "Personal Project" }],
  },
  {
    _id: "4f655518-ab2c-8321-cdaa-bf06c78417ee",
    name: "JWD Portfolio",
    image: "images/JWDPortfolio.png",
    desc: "This is my personal portfolio website built using React and Bootstrap...",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    contributions: [{ name: "Personal Project" }],
  },
];

// Validation function
function validateProject(body) {
  const schema = Joi.object({
    _id: Joi.string().allow(""),
    name: Joi.string().min(3).required(),
    desc: Joi.string().required(),
    skills: Joi.string().required(),
    contributions: Joi.string().required(),
    github: Joi.string().allow(""),
    devpost: Joi.string().allow(""),
  });
  return schema.validate(body);
}

// Routes
app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.post("/api/projects", upload.single("img"), (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let skills = [];
  let contributions = [];
  try {
    skills = JSON.parse(req.body.skills);
    contributions = JSON.parse(req.body.contributions);
  } catch {
    return res.status(400).send("Invalid JSON in skills or contributions");
  }

  const project = {
    _id: req.body._id || uuidv4(),
    name: req.body.name,
    desc: req.body.desc,
    skills,
    contributions,
    image: req.file ? `images/${req.file.filename}` : undefined,
  };

  projects.push(project);
  res.json(project);
});

app.put("/api/projects/:id", upload.single("img"), (req, res) => {
  const project = projects.find((p) => p._id === req.params.id);
  if (!project) return res.status(404).send("Project not found");

  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    project.skills = JSON.parse(req.body.skills);
    project.contributions = JSON.parse(req.body.contributions);
  } catch {
    return res.status(400).send("Invalid JSON in skills or contributions");
  }

  project.name = req.body.name;
  project.desc = req.body.desc;
  if (req.file) project.image = `images/${req.file.filename}`;

  res.json(project);
});

app.delete("/api/projects/:id", (req, res) => {
  const index = projects.findIndex((p) => p._id === req.params.id);
  if (index === -1) return res.status(404).send("Project not found");
  const [deleted] = projects.splice(index, 1);
  res.json(deleted);
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

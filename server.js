const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + "-" + file.originalname;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });

// Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Sample projects data - Fixed duplicate ID issue
let projects = [
  {
    _id: "8f298c04-00ed-42bc-b8f7-eaf3ec6ce5df",
    name: "DaVinci Academia",
    image: "images/Davinci.png",
    desc: "DaVinci Academia is a recreation of a University Course and Major review system. The project was created as a mock full-stack software development life cycle, in which we covered topics such as Requirements elicitation, UML design, Scrum management, Backend development, Database development, Frontend development, and more",
    skills: [
      "Java",
      "JSON",
      "Unit Testing",
      "Git",
      "Scrum",
      "UML Design",
      "Backend development",
      "Database development",
      "Frontend development",
    ],
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
    desc: "PostOne is a Smart Mailbox attachment created at 2025 CUHackit Hackathon. When the mailbox door opens, an image is taken of the person who opened it, and an email is sent to a user that their mailbox has been opened, as well as whether or not the person who opened it is a recognized user.",
    skills: [
      "Python",
      "Amazon Web Services (AWS)",
      "Lambda Functions",
      "S3 Buckets",
      "Simple Email Service",
    ],
    contributions: [{ name: "Personal Project" }],
  },
  {
    _id: "4f655518-ab2c-8321-cdaa-bf06c78417ee", // Fixed duplicate ID
    name: "JWD Portfolio",
    image: "images/JWDPortfolio.png",
    desc: "This is my personal portfolio website (This Website) built using React and Bootstrap. It is my cumulative project for my Web Applications class in which it started as a static HTML website and was built from the ground up into a fully fledged Web Application.",
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "Web Design",
      "UX/UI Design",
      "Wireframing",
      "Prototyping",
      "React",
      "Bootstrap",
    ],
    contributions: [{ name: "Personal Project" }],
  },
];

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.post("/api/projects", upload.single("img"), (req, res) => {
  console.log("Received form data:", req.body);
  console.log("Received file:", req.file);

  const result = validateProject(req.body);

  if (result.error) {
    console.log("Error Occurred:", result.error.details[0].message);
    res.status(400).send(result.error.details[0].message);
    return;
  }

  let skills = [];
  let contributions = [];

  try {
    if (req.body.skills) {
      skills = JSON.parse(req.body.skills);
    }
    if (req.body.contributions) {
      contributions = JSON.parse(req.body.contributions);
    }
  } catch (e) {
    console.log("JSON Parse Error:", e);
    res.status(400).send("Invalid JSON format in skills or contributions");
    return;
  }

  const project = {
    _id: req.body._id || crypto.randomUUID(),
    name: req.body.name,
    desc: req.body.desc,
    skills: skills,
    contributions: contributions,
  };

  if (req.file) {
    project.image = `public/images/${req.file.filename}`;
    console.log("Image path set to:", project.image);
  }

  projects.push(project);

  console.log("Created project:", project);

  res.status(200).json(project);
});

const validateProject = (project) => {
  const schema = Joi.object({
    _id: Joi.string().allow(""),
    name: Joi.string().min(3).required(),
    desc: Joi.string().required(),
    skills: Joi.string().required(),
    contributions: Joi.string().required(),
    github: Joi.string().allow(""),
    devpost: Joi.string().allow(""),
  });

  return schema.validate(project);
};

// Start server
app.listen(3001, () => {
  console.log("Server running on port 3000");
});

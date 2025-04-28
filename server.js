const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const app = express();

app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "public", "images")),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

mongoose
  .connect("mongodb+srv://jwdaw:jwdaw@portfoliocluster.9kytcmq.mongodb.net/")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("couldn't connect to mongodb", error);
  });

const projectSchema = new mongoose.Schema({
  name: String,
  desc: String,
  skills: [String],
  contributions: [{ name: String }],
  github: String,
  image: String,
});

const Project = mongoose.model("Project", projectSchema);

function validateProject(body) {
  const schema = Joi.object({
    _id: Joi.string().allow(""),
    name: Joi.string().min(3).required(),
    desc: Joi.string().required(),
    skills: Joi.string().required(),
    contributions: Joi.string().required(),
  });
  return schema.validate(body);
}

app.get("/api/projects", async (req, res) => {
  const projects = await Project.find();
  res.send(projects);
});

app.post("/api/projects", upload.any(), async (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let skills, contributions;
  try {
    skills = JSON.parse(req.body.skills);
    contributions = JSON.parse(req.body.contributions);
  } catch {
    return res.status(400).send("Invalid JSON in skills or contributions");
  }

  // Log file information for debugging
  console.log("Received files:", req.files);

  const project = new Project({
    name: req.body.name,
    desc: req.body.desc,
    skills,
    contributions,
    github: req.body.github,
    image: req.body.filename,
  });

  const newProject = await project.save();
  res.status(200).send(newProject);
});

app.put("/api/projects/:id", upload.any(), async (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let skills, contributions;
  try {
    skills = JSON.parse(req.body.skills);
    contributions = JSON.parse(req.body.contributions);
  } catch {
    return res.status(400).send("Invalid JSON in skills or contributions");
  }

  // Log file information for debugging
  console.log("Received files on PUT:", req.files);

  const updateData = {
    name: req.body.name,
    desc: req.body.desc,
    skills,
    contributions,
    github: req.body.github,
    image: req.body.filename,
  };

  const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  if (!project) return res.status(404).send("Project not found");

  res.status(200).send(project);
});

app.delete("/api/projects/:id", async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).send("Project not found");
  res.json(project);
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

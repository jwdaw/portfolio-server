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
  contributions: [String, String],
  github: String,
  img: String,
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

app.post("/api/projects", upload.single("img"), async (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let skills, contributions;
  try {
    skills = JSON.parse(req.body.skills);
    contributions = JSON.parse(req.body.contributions);
  } catch {
    return res.status(400).send("Invalid JSON in skills or contributions");
  }

  const project = new Project({
    name: req.body.name,
    desc: req.body.desc,
    skills,
    contributions,
    github: req.body.github,
    img: req.file ? `images/${req.file.filename}` : undefined,
  });

  const newProject = await project.save();
  res.status(200).send(newProject);
});

app.put("/api/projects/:id", upload.single("img"), async (req, res) => {
  const { error } = validateProject(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    project.skills = JSON.parse(req.body.skills);
    project.contributions = JSON.parse(req.body.contributions);
  } catch {
    return res.status(400).send("Invalid JSON in skills or contributions");
  }

  const fieldsToUpdate = {
    name: req.body.name,
    desc: req.body.desc,
    skills: req.body.skills,
    contributions: req.body.contributions,
  };

  if (req.file) fieldsToUpdate.image = `images/${req.file.filename}`;

  const wentThrough = await Project.updateOne(
    { _id: req.params.id },
    fieldsToUpdate
  );

  const project = await House.findOne(_id.req.params.id);

  res.status(200).send(project);
});

app.delete("/api/projects/:id", (req, res) => {
  const index = projects.findIndex((p) => p._id === req.params.id);
  if (index === -1) return res.status(404).send("Project not found");
  const [deleted] = projects.splice(index, 1);
  res.json(deleted);
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/projects", (req, res) => {
  const projects = [
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
        {
          url: "https://github.com/Shreklord",
          name: "Anthony Goldhammer",
        },
        {
          url: "https://github.com/olliekod",
          name: "Oliver Meihls",
        },
        {
          url: "https://github.com/sphilips04",
          name: "Spencer Philips",
        },
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
      contributions: [
        {
          name: "Personal Project",
        },
      ],
    },
    {
      _id: "31655518-db2b-4727-bbaa-bf06c78417cb",
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
      contributions: [
        {
          name: "Personal Project",
        },
      ],
    },
  ];
  res.send(projects);
});

app.listen(3001, () => {
  console.log("I'm Listening!");
});

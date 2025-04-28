document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/projects")
    .then((res) => res.json())
    .then((projects) => {
      const container = document.getElementById("projects");
      projects.forEach((p) => {
        const card = document.createElement("div");
        card.className = "project-card";

        const img = document.createElement("img");
        img.src = p.img || "";
        img.alt = p.name || "Project image";
        card.appendChild(img);

        const title = document.createElement("h4");
        title.textContent = p.name;
        card.appendChild(title);

        container.appendChild(card);
      });
    })
    .catch((err) => console.error("Error loading projects", err));
});

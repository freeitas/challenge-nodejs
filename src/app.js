const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function getRepoIndex(id) {
  return repositories.findIndex((repo) => repo.id === id);
}

function validateRepoId(request, response, next) {
  const repoIndex = getRepoIndex(request.params.id);

  if (repoIndex < 0)
    return response.status(400).json({ error: "Repository was not found" });

  return next();
}

app.use("/repositories/:id", validateRepoId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const repoIndex = getRepoIndex(request.params.id);

  const repo = repositories[repoIndex];

  repositories[repoIndex] = {
    id: repo.id,
    title,
    url,
    techs,
    likes: repo.likes,
  };

  return response.json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const repoIndex = getRepoIndex(request.params.id);

  repositories.splice(repoIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const repoIndex = getRepoIndex(request.params.id);

  repositories[repoIndex].likes++;

  return response.json(repositories[repoIndex]);
});

module.exports = app;

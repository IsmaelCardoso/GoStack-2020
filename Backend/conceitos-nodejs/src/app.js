const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateProjectId = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Ivalid project ID." });
  }

  return next();
};

app.use("/repositories/:id", validateProjectId);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const results = { id: uuid(), url, title, techs, likes: 0 };

  repositories.push(results);

  return response.status(201).json(results);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "Repository not found" });
  }

  currentRepository = repositories[repositoryIndex];

  const { likes } = currentRepository;

  const repositoryUpdated = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repositoryUpdated;

  return response.status(200).json(repositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const { like } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "Repository not found" });
  }

  currentRepository = repositories[repositoryIndex];

  let { title, url, techs, likes } = currentRepository;

  likes = likes + 1;

  const repositoryUpdated = {
    id,
    title,
    url,
    techs,
    likes,
  };

  repositories[repositoryIndex] = repositoryUpdated;

  return response.status(201).json({ likes });
});

module.exports = app;

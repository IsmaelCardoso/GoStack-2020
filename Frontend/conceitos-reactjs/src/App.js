import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./styles.css";

const App = () => {
  const [repositories, setRepositories] = useState([{}]);

  useEffect(() => handleListRepositories(), []);

  const handleListRepositories = () => {
    api.get("repositories").then((res) => {
      setRepositories(res.data);
    });
  };

  const handleAddRepository = async () => {
    const response = await api.post("repositories", {
      title: "Desafio ReactJS",
      url: "https://github.com/IsmaelCardoso/proffy_plataform_classes_backend",
      techs: ["NodeJS"],
    });

    setRepositories([...repositories, response.data]);
  };

  const handleRemoveRepository = async (id) => {
    await api.delete(`repositories/${id}`);

    const repsitoryUpdated = repositories.filter((repo) => repo.id !== id);

    setRepositories([...repsitoryUpdated]);
  };

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories.map((repository, index) => (
          <li key={index}>
            {repository.title}
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
};

export default App;

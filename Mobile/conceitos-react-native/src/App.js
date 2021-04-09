import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

import styles from "./App.css";

const App = () => {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("repositories").then((res) => {
      setRepositories([...res.data]);
    });
  }, []);

  const handleLikeRepository = async (id) => {
    const response = await api.post(`repositories/${id}/like`);

    const repository = repositories.find((repository) => repository.id === id);

    const repositoryIndex = repositories.findIndex(
      (repository) => repository.id === id
    );

    repository.likes = response.data.likes;

    const results = repositories;

    results.splice(repositoryIndex, 1, repository);

    setRepositories([...results]);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        {repositories.map((repository) => {
          return (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{repository.title}</Text>

              <View style={styles.techsContainer}>
                {repository.techs.map((tech) => (
                  <Text style={styles.tech}>{tech}</Text>
                ))}
              </View>

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  testID={`repository-likes-${repository.id}`}
                >
                  {repository.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </SafeAreaView>
    </>
  );
};

export default App;

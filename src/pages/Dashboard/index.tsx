import React, { useState, FormEvent, useEffect } from "react";

import { Title, Form, Repositories } from "./styles";

import {Link} from 'react-router-dom'

import { FiChevronRight } from "react-icons/fi";

import logoImg from "../../assets/logo.svg";

import api from "../../services/api";

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>(()=>{
    const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');
    
    if(storageRepositories ){
      return JSON.parse(storageRepositories );
    }

    return [];

    }
  );

  useEffect(()=>{
    localStorage.setItem('@GithubExplorer:repositories',JSON.stringify(repositories));
  },[repositories])

  const handleAddRepository = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const response = await api.get(`repos/${newRepo}`);

    const repository = response.data;

    setRepositories([...repositories, repository]);
    setNewRepo('');
  };

  return (
    <>
      <img alt="Github Explorer" src={logoImg} />
      <Title>Explore repositórios no Github</Title>
      <Form onSubmit={handleAddRepository} action="">
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      <Repositories>
        {repositories.map((repository) => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;

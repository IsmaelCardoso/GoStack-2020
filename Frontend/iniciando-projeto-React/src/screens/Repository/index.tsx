import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';

import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import logoImg from '../../assets/logo.svg';

import { Header, RepositoryInfo, Issues } from './styled';

interface RepositoryParams {
  repository: string;
}

interface Repository {
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface Issue {
  id: number;
  title: string;
  html_url: string;
  user: {
    login: string;
  };
}

const Repository: React.FC = () => {
  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  const { params } = useRouteMatch<RepositoryParams>();

  useEffect(() => {
    /* DA FORMA ABAIXO, SERIA UMA DAS FORMA CORRETAS DE SE FAZER AS REQUISIÇÕES DE FORMA SIMULTANEA **/
    // api.get(`/repos/${params.repository}`).then((response) => {
    //   console.log('DATAREPOSITORY', response.data);
    // });
    // api.get(`/repos/${params.repository}/issues`).then((response) => {
    //   console.log('DATAREPOSITORY', response.data);
    // });

    const loadData = async (): Promise<void> => {
      /* ##DA FORMA ABAIXO, VAI SER EXECUTADO DUAS REQUISIÇÕES "UMA DE CADA VEZ" E ISSO NÃO É UMA BOA PRATICA NESTE CASO, AFINAL UMA NÃO DEPENDE DA OUTRA## **/
      //   const repository = await api.get(`/repos/${params.repository}`);
      //   const issues = await api.get(`/repos/${params.repository}/issues`);

      /* DA FORMA ABAIXO, É OUTRA FORMA CORRETA DE FAZER DUAS OU MAIS REQUISIÇÕES SIMULTANEAS **/
      const [repository, issues] = await Promise.all([
        api.get(`/repos/${params.repository}`),
        api.get(`/repos/${params.repository}/issues`),
      ]);

      setRepository(repository.data);
      setIssues(issues.data);
    };

    loadData();
  }, [params.repository]);

  return (
    <>
      <Header>
        <img src={logoImg} alt='Logo Github Explorer' />
        <Link to='/'>
          <FiChevronLeft size={16} />
          Voltar
        </Link>
      </Header>
      {repository && (
        <RepositoryInfo>
          <header>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
          </header>
          <ul>
            <li>
              <strong>{repository.stargazers_count}</strong>
              <span>Stars</span>
            </li>

            <li>
              <strong>{repository.forks_count}</strong>
              <span>Forks</span>
            </li>

            <li>
              <strong>{repository.open_issues_count}</strong>
              <span>Issues abertas</span>
            </li>
          </ul>
        </RepositoryInfo>
      )}

      <Issues>
        {issues.map((issue) => (
          <a key={issue.id} href={issue.html_url}>
            <div>
              <strong>{issue.title}</strong>
              <p>{issue.user.login}</p>
            </div>
            <FiChevronRight size={20} />
          </a>
        ))}
      </Issues>
    </>
  );
};

export default Repository;

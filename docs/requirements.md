# EBD API | ESCOLA BÍBLICA DOMINICAL

## RFs (Requisitos Funcionais)

- ✅ Deve ser possível se autenticar;
- [ ] Deve ser possível recuperar a senha;
- ✅ Deve ser possível obter os dados de um usuário;
- ✅  Deve ser possível cadastrar um membro;
- ✅  Deve ser possível cadastrar um usuário
- ✅  Deve ser possível associar um membro já cadastrado a um usuário
- ✅ Deve ser possível cadastrar trimestre;
- [ ] Deve ser possível cadastrar professores;
- [ ] Deve ser possível matricular alunos;
- [ ] Deve ser possível cadastrar classes;
- [ ] Deve ser possível cadastrar aulas;
- [ ] Deve ser possível registrar a presença dos alunos;
- [ ] Deve ser possível registrar a presença dos professores;
- [ ] Deve ser possível visualizar a frequência de um aluno;
- [ ] Deve ser possível visualizar a frequência de um professor;

- [ ] Deve ser possível gerar estatísticas de participação;
- [ ] Deve ser possível emitir relatórios de presença;

## RNs (Regras de Negócio)

- ✅ Não podem haver dois usuários com o mesmo email;
- ✅ Só podem haver 4 trimestres para um mesmo ano;
- ✅ Não podem haver dois usuários com o mesmo username;
- ✅ O sistema deve respeitar os níveis de permissão dos usuários (RBAC);
    1. SHEPHERD
    2. SUPERINTENDENT
    3. PEDAGOGICAL_DEPARTMENT
    5. SECRETARY
    4. TEACHER
    6. COMMON
- [ ] Um professor só pode ser cadastrado por [1,2,3,4];

## RNFs (Requisitos Não-Funcionais)

- ✅ A senha dos usuários precisa estar criptografada;
- ✅ Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- ✅ O usuário deve ser identificado por um JWT (JSON Web Token);


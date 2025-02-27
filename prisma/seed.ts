/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient, Sex } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const members = [
  {
    name: 'Adriele de Assis do Nascimento',
    birthDate: new Date('2004-08-21'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Alany Silva dos Santos',
    birthDate: new Date('2007-09-04'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Ana Leticia Vasconcelos Rocha',
    birthDate: new Date('2004-09-24'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Ana Priscila Vieira Aragão',
    birthDate: new Date('2011-08-15'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Ana Sávya da Conceição Ramos',
    birthDate: new Date('2005-08-30'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Artur Moreira do Nascimento',
    birthDate: new Date('2007-07-23'),
    sex: Sex.MALE,
  },
  {
    name: 'Calebe Conceição Martins Ferreira',
    birthDate: new Date('2008-03-13'),
    sex: Sex.MALE,
  },
  {
    name: 'Carlos Yuri Brito Sousa',
    birthDate: new Date('2004-05-24'),
    sex: Sex.MALE,
  },
  { name: 'Ciane Farias', birthDate: new Date('1992-01-29'), sex: Sex.FEMALE },
  {
    name: 'Eduardo da Silva Pereira',
    birthDate: new Date('1999-11-16'),
    sex: Sex.MALE,
  },
  {
    name: 'Elir Moreira do Nascimento',
    birthDate: new Date('2009-09-06'),
    sex: Sex.MALE,
  },
  {
    name: 'Elson da Silva Pereira',
    birthDate: new Date('2004-07-04'),
    sex: Sex.MALE,
  },
  {
    name: 'Ernandes Santos Alves',
    birthDate: new Date('1996-06-26'),
    sex: Sex.MALE,
  },
  {
    name: 'Esli Luiz Vieira Aragão',
    birthDate: new Date('2008-10-12'),
    sex: Sex.MALE,
  },
  {
    name: 'Ester Carvalho de Paiva',
    birthDate: new Date('1999-06-09'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Ester Cavalcante de Souza',
    birthDate: new Date('2012-03-06'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Ezequiel Cavalcante de Sousa',
    birthDate: new Date('2009-03-07'),
    sex: Sex.MALE,
  },
  {
    name: 'Fabíola Maria Cardoso de Lima',
    birthDate: new Date('1984-06-28'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Francilene Lucena Vieira',
    birthDate: new Date('2002-12-27'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Francisco Enson Souza Gomes',
    birthDate: new Date('2001-01-16'),
    sex: Sex.MALE,
  },
  {
    name: 'Francisco Luilio da Conceição Rocha',
    birthDate: new Date('1999-12-30'),
    sex: Sex.MALE,
  },
  {
    name: 'Gabriel de Souza Pereira',
    birthDate: new Date('2010-11-08'),
    sex: Sex.MALE,
  },
  {
    name: 'Gabriel Vasconcelos Rocha',
    birthDate: new Date('2007-05-06'),
    sex: Sex.MALE,
  },
  {
    name: 'Geovana Castro Brandão',
    birthDate: new Date('2011-09-08'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Gilvania Barros da Silva',
    birthDate: new Date('2002-05-04'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Helder Moreira do Nascimento',
    birthDate: new Date('2009-09-06'),
    sex: Sex.MALE,
  },
  {
    name: 'Isac Marques de Souza',
    birthDate: new Date('2002-02-04'),
    sex: Sex.MALE,
  },
  {
    name: 'Kelvin da Silva Pereira',
    birthDate: new Date('2009-03-26'),
    sex: Sex.MALE,
  },
  {
    name: 'Lázaro Marques Costa',
    birthDate: new Date('2007-01-03'),
    sex: Sex.MALE,
  },
  {
    name: 'Leandro Santos Araujo',
    birthDate: new Date('1995-07-31'),
    sex: Sex.MALE,
  },
  {
    name: 'Leticia Nascimento Santos',
    birthDate: new Date('2011-03-29'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Marcos Alves Viana',
    birthDate: new Date('1996-02-15'),
    sex: Sex.MALE,
  },
  {
    name: 'Maressa Kelle de Almeida Matos',
    birthDate: new Date('2005-04-05'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Maria Lolita da Rocha Carvalho',
    birthDate: new Date('2010-04-03'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Maria Thalya Benício Cardoso',
    birthDate: new Date('2000-06-25'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Mariana Helen Silva dos Santos',
    birthDate: new Date('2001-03-14'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Naara Nascimento Alves',
    birthDate: new Date('1994-01-21'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Naianny Calixto Lopes',
    birthDate: new Date('1997-08-29'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Paulo Lucas Ramos Rodrigues',
    birthDate: new Date('2002-05-21'),
    sex: Sex.MALE,
  },
  {
    name: 'Ray Pereira dos Santos',
    birthDate: new Date('2006-01-02'),
    sex: Sex.MALE,
  },
  {
    name: 'Rhamon Asafe da Silva Costa',
    birthDate: new Date('1998-09-30'),
    sex: Sex.MALE,
  },
  {
    name: 'Ricardo Souza Pereira',
    birthDate: new Date('2008-06-06'),
    sex: Sex.MALE,
  },
  {
    name: 'Sara Cardoso Fontenele',
    birthDate: new Date('2005-09-12'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Sterfany Vitória de Souza Gomes',
    birthDate: new Date('2010-04-09'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Thalyson Elione Alves de Freitas Santos',
    birthDate: new Date('2002-11-02'),
    sex: Sex.MALE,
  },
  {
    name: 'Vitor Câmara do Nascimento',
    birthDate: new Date('2004-11-19'),
    sex: Sex.MALE,
  },
  {
    name: 'Viviane Queiroz Silva',
    birthDate: new Date('2001-08-24'),
    sex: Sex.FEMALE,
  },
  {
    name: 'Waldeck Esequiel de Morais Neto',
    birthDate: new Date('2001-09-08'),
    sex: Sex.MALE,
  },
];

async function createUser() {
  await prisma.user.create({
    data: {
      email: 'test@gmail.com',
      role: 'SHEPHERD',
      username: 'test',
      passwordHash: await hash('12345678', 8),
    },
  });
}

async function main() {
  await prisma.member.deleteMany();
  await prisma.user.deleteMany();
  console.log('Table members is reseted.');

  await prisma.member.createMany({ data: members });
  await createUser();
  console.log('Seed successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

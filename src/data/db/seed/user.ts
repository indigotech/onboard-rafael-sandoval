import { User } from '@data/db/entity/user';
import * as faker from 'faker';
import { getRepository } from 'typeorm';
import { hash } from '@core/authentication';

export const userSeed = async () => {
  const repo = getRepository(User);

  const userList: User[] = [];

  for (let i = 0; i < 50; i++) {
    const user = {
      name: faker.name.findName(),
      email: faker.internet.email(),
      birthDate: faker.date.past(),
      cpf: '12345678900',
      password: hash('senha123'),
    };
    const userEntity = repo.create(user);
    userList.push(userEntity);
  }
  repo.save(userList);
};

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  birthDate: Date;

  @Column()
  cpf: string;

  @Column()
  password: string;
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  birthDate: Date;
  cpf: string;
  password: string;
}

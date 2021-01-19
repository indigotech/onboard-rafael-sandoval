import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Address, IAddress } from '@data/db/entity/address';

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

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}

export interface IUser {
  id?: number;
  name: string;
  email: string;
  birthDate: Date | string;
  cpf: string;
  password: string;
  addresses?: IAddress[];
}

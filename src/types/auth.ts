import { ReactElement } from 'react';
import { DynamicObject } from './field';

// ==============================|| AUTH TYPES  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  id?: string;
  email?: string;
  avatar?: string;
  image?: string;
  name?: string;
  role?: string;
  tier?: string;
};


export type AuthProps = {
  profile: DynamicObject
  role: number
}
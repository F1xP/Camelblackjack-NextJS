import { getServerSession } from 'next-auth';
import { authOptions } from './authOptions';

export const getSession = () => getServerSession(authOptions);

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user;
};

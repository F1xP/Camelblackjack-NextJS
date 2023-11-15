import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route';

export const getSession = () => getServerSession(nextAuthOptions);

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user;
};

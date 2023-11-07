import User from '@/database/user.model';
import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_ID as string) ?? '',
      clientSecret: (process.env.GOOGLE_SECRET as string) ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await User.findOneAndUpdate(
          { email: user.email },
          {
            name: user.name,
            email: user.email,
            image: user.image,
          },
          {
            upsert: true,
          }
        );
      } catch (e) {
        console.log(e);
        return false;
      }
      return true;
    },
  },
};

import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

import { prisma } from '../../../server/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: 'email',
          label: 'Email',
        },
        password: {
          type: 'password',
          label: 'Passowrd',
        },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            password: true,
            username: true,
          },
        });

        if (!user) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return {
          email,
          name: user.username,
          image: null,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60,
  },
  pages: {
    signIn: '/auth/login',
  },
};

export default NextAuth(authOptions);

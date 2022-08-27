import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import type { NextPage, GetServerSideProps } from 'next';
import type { SubmitHandler } from 'react-hook-form';

import AuthLayout from '../../components/auth/layout';
import AuthForm from '../../components/auth/form';
import { getSeverSession } from '../../utils/session';
import { LOGIN_FIELDS } from '../../constants/auth/form';
import { type LoginFieldNames, AuthMode } from '../../types/auth/form';

const Login: NextPage = () => {
  const [isServerError, setIsServerError] = useState(false);
  const router = useRouter();

  const handleSubmit: SubmitHandler<LoginFieldNames> = async (fields) => {
    const result = await signIn('credentials', {
      ...fields,
      redirect: false,
    });

    if (result?.ok) {
      const { callbackUrl } = router.query;
      await router.push((callbackUrl as string | undefined) ?? '/');
    } else {
      setIsServerError(true);
    }
  };

  return (
    <AuthLayout
      mode={AuthMode.Login}
      error={{
        open: isServerError,
        text: 'Invalid email or password',
        onClose: () => setIsServerError(false),
      }}
    >
      <AuthForm fields={LOGIN_FIELDS} onSubmit={handleSubmit} />
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSeverSession(ctx);
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Login;

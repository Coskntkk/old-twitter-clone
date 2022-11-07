import 'bootstrap/dist/css/bootstrap.css';
import '../styles/styles.css';
import '../styles/login.css';
import '../styles/register.css';
import '../styles/feed.css';
import '../styles/profile.css';
import '../styles/search.css';

import Head from 'next/head';
import MainLayout from '../layouts/MainLayout';
import AuthContextProvider from '../context/authContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Head>
        <title>Old Twitter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </AuthContextProvider>
  )
}

export default MyApp

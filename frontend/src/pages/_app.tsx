import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { wrapper } from '../store/store';
import { Provider, } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Karla } from 'next/font/google';
import 'animate.css';
import '../assets/global.scss';

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla'
});

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return <ThemeProvider attribute="class">
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.__persistor}>
        <main className={`${karla.variable} font-sans`}>
          <Component {...props.pageProps} />
        </main>
      </PersistGate>
    </Provider>
  </ThemeProvider>
}

export default App;
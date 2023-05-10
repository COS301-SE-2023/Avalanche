import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { wrapper } from '../store/store';
import { useStore } from 'react-redux';
import { Provider } from 'react-redux';
import { Karla } from 'next/font/google';

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla'
});


function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return <ThemeProvider attribute="class">
    <main className={`${karla.variable} font-sans`}>
      <Provider store={store}>
        <Component {...props.pageProps} />
      </Provider>
    </main>
  </ThemeProvider>
}

export default wrapper.withRedux(App);

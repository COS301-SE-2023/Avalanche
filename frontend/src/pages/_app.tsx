import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { wrapper } from '../store/store';
// import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';
import { Provider } from 'react-redux';

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return <ThemeProvider attribute="class">
    <Provider store={store}>
      <Component {...props.pageProps} />
    </Provider>
  </ThemeProvider>
}

export default wrapper.withRedux(App);

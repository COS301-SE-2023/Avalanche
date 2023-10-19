import '@/styles/globals.css';
import 'animate.css';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import { Provider, } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '../assets/global.scss';
import { wrapper } from '../store/store';

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return <ThemeProvider
    storageKey='theme'
    attribute="class"
    defaultTheme="light"
    enableSystem={false}
    themes={["light", "dark"]}
  >
    <Provider store={store}>
      <PersistGate loading={null} persistor={store.__persistor}>
        <main>
          <Component {...props.pageProps} />
        </main>
      </PersistGate>
    </Provider>
  </ThemeProvider>
}

export default App;
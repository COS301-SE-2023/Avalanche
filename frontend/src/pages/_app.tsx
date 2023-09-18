import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { wrapper } from '../store/store';
import { Provider, } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'animate.css';
import '../assets/global.scss';

function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  return <ThemeProvider
    storageKey='theme'
    enableSystem={false}
    forcedTheme='light'
    enableColorScheme={false}
    themes={['light']}
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
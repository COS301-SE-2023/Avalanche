import { Html, Head, Main, NextScript } from 'next/document'
import { useEffect } from 'react'

export default function Document() {

  useEffect(() => {
    const errorHandler = (event: any) => {
      console.error('Unhandled Error:', event.error);
      // You can also display a user-friendly message here.
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

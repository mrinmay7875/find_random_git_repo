import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { theme } from '../theme';
import ReactQueryProvider from '../src/utils/provider/ReactQueryProvider';

export const metadata = {
  title: 'Random Github repo finder',
  description: 'Find random github repo',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang='en'>
      <head>
        <ColorSchemeScript />
        {/* In order for Favicon to work make sure to rename it to icon.ico and put inside app folder */}
        <link rel='shortcut icon' href='./icon.ico' />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no'
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ReactQueryProvider>
            <main>{children}</main>
          </ReactQueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

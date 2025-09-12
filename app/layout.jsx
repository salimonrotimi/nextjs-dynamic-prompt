// This is where whatever will be used across all pages (e.g. Navbar) is set up. It is similar to 
// the App() function in React.

// NOTE: all file names for loading pages in Next.js must be named with "page.jsx" or "page.tsx".
// NOTE: all file names for API route pages in Next.js must be named with "route.js" or "route.ts".
//       page.jsx and route.js and the corresponding TypeScript version cannot be used in the same folder
// NOTE: all file names for handling page layout in Next.js must be named with "layout.jsx" or "layout.tsx".

import "@styles/globals.css";   // only applied on this root-layout for the <body> tag and the "classNames"
import Nav from '@components/nav/navbar'
import AppSessionProvider from "@components/session-provider";
import localFont from "next/font/local";
import ToasterProvider from "@components/toast-provider"; //OR import {Toaster} from "react-hot-toast";
// directly and set up "Toaster" component i.e. <Toaster position="top-center" reverseOrder={false} gutter={8}/>
// after {children} if "ToasterProvider" component was not created previously.


/*
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

//The above font declaration can be used as class name in any html tags e.g.
//  <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}></body>
//This output as the folowing code. Each class property must be defined in the "global.css" file. 
//  <body className="--font-geist-sans --font-geist-mono antialiased"></body>
*/

export const metadata = {
  title: "Tecnic",
  description: "Your dynamic tech social interaction tool.",
};


export default function RootLayout({ children }) {
  // The AppSessionProvider component (which uses session through the SessionProvider) is used as the root
  // tag to make authentication available across all the pages wherever it is needed.
  // The contents of the various "page.jsx" files are automatically inserted where the "{children}" is.
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppSessionProvider>
          <div className="main">
            <div className="gradient"/>
          </div>
          <main className="app">
            <Nav />
            {children}            
          </main>
          <ToasterProvider/>
        </AppSessionProvider>
      </body>
    </html>
  );
}

"use client";       // added mainly because of the react hook "SessionProvider"

import { SessionProvider } from "next-auth/react"


// "AppSessionProvider()" function which serve as the root function can also be renamed as "App()"
function AppSessionProvider({children, session}) {
  // <SessionProvider> wraps the app in to make "session" data available globally everywhere in the app
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  )
}

export default AppSessionProvider
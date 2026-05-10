import { Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import LandingPage from "./pages/LandingPage"
import { Auth } from "./pages/AuthPage"
import SignUpPage from "./pages/SignUpPage"
// import { SignedIn } from "@neondatabase/neon-js/auth/react"


function App() {

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/:pathname" element={<Auth />} />
        <Route path="/auth/signup" element={<SignUpPage />} />
      </Routes>
    </>
  )
}

export default App

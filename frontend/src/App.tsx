import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { AppShell } from "@/components/layout/app-shell"
import { GuestOnly } from "@/routes/guest-only"
import { RequireAuth } from "@/routes/require-auth"
import { LoginPage } from "@/pages/login-page"
import { PrDetailPage } from "@/pages/pr-detail-page"
import { PrListPage } from "@/pages/pr-list-page"
import { PrNewPage } from "@/pages/pr-new-page"
import { SignupPage } from "@/pages/signup-page"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestOnly>
              <SignupPage />
            </GuestOnly>
          }
        />

        <Route
          element={
            <RequireAuth>
              <AppShell />
            </RequireAuth>
          }
        >
          <Route path="/prs" element={<PrListPage />} />
          <Route path="/prs/new" element={<PrNewPage />} />
          <Route path="/prs/:id" element={<PrDetailPage />} />
          <Route path="/" element={<Navigate to="/prs" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/prs" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

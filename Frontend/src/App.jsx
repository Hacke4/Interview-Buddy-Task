import DashboardPage from "./pages/DashboardPage";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import OrganizationsPage from "./pages/OrganizationsPage";
import OrganizationDetails from "./pages/OrganizationDetails";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardLayout>
            <DashboardPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/organizations"
        element={
          <DashboardLayout>
            <OrganizationsPage />
          </DashboardLayout>
        }
      />
      <Route
        path="/organizations/:id"
        element={
          <DashboardLayout>
            <OrganizationDetails />
          </DashboardLayout>
        }
      />
    </Routes>
  );
}

export default App;

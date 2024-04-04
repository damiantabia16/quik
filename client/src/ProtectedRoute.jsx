import { useAuth } from "./hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

  const { isAuth, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner">Cargando...</div>
      </div>
    )
  }

  if (!loading && !isAuth) {
    return <Navigate to='/ingresar' replace />
  }

  return <Outlet />
}

export default ProtectedRoute;
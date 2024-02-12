import { useAuth } from "./hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {

  const { isAuth, loading } = useAuth();

  if (loading) {
    return (
      <h1>Cargando...</h1>
    )
  }

  if (!loading && !isAuth) {
    return <Navigate to='/ingresar' replace />
  }

  return <Outlet />
}

export default ProtectedRoute;
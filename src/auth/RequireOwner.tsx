import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type Props = {
    children: React.ReactNode;
};

export default function RequireOwner({ children }: Props) {
    const { user } = useAuth();

    //  logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // logged in αλλά όχι owner
    if (!user.isOwner) {
        return <Navigate to="/" replace />;
    }

    //  owner
    return <>{children}</>;
}

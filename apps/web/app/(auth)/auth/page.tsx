import AuthContainer from "@/components/auth/AuthContainer";
import AuthGuard from "@/components/shared/AuthGuard";

const AuthPage = () => {
  return (
    <AuthGuard requireAuth={false}>
      <AuthContainer />
    </AuthGuard>
  );
};

export default AuthPage;

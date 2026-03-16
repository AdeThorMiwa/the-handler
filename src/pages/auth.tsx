import { useGoogleLogin } from "@react-oauth/google";

const AuthPage = () => {
  const login = useGoogleLogin({
    flow: "auth-code",
    redirect_uri: "http://localhost:5173",
    scope:
      "openid email profile https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/gmail.readonly",

    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
    },
  });

  return (
    <div>
      <h1>Auth Page</h1>
      <button onClick={login}>Login with google</button>
    </div>
  );
};

export default AuthPage;

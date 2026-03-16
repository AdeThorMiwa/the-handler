import { GoogleOAuthProvider } from "@react-oauth/google";
import { Env } from "./constants/env";
import type { FC, PropsWithChildren } from "react";

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={Env.GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default Providers;

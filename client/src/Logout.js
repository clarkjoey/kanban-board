import React from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";

function Logout() {
  const { logout, isAuthenticated } = useAuth0();

  return (
    isAuthenticated && (
        <div onClick={() => logout({ logoutParams: { returnTo: "https://flowdaily.app" } })}>
            Logout
        </div>
    )
  );
}

export default Logout;
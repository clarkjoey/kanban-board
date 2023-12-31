import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <>Loading ...</>;
  }

  return (
    isAuthenticated && (
        <>{user.name}</>
    )
  );
};

export default Profile;
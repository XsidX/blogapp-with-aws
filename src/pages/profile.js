import React, { useState, useEffect } from "react";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const data = await Auth.currentAuthenticatedUser();
      const userInfo = { username: data.username, ...data.attributes };
      console.log("userInfo: ", userInfo);
      setUser(userInfo);
    } catch (err) {
      console.log("error: ", err);
    }
  }

  return !user ? (
    <div>Loading...</div>
  ) : (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide">Profile</h1>
      <h2 className="tracking-wide mt-3">{user.username}</h2>
      <h2 className="tracking-wide">{user.email}</h2>
      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(Profile);
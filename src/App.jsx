import React, { useState } from "react";
import SignIn from "./SignIn.jsx";
import SignUp from "./SignUp.jsx";

function App() {
  const [view, setView] = useState("signin"); // "signin" | "signup"

  const handleSignedIn = (data) => {
    // TODO: connect this with your routing / token storage
    console.log("Signed in:", data);
  };

  const handleSignedUp = (data) => {
    console.log("Account created:", data);
    // After successful sign-up, go to sign-in
    setView("signin");
  };

  if (view === "signup") {
    return (
      <SignUp
        onSignedUp={handleSignedUp}
        onGoToSignIn={() => setView("signin")}
      />
    );
  }

  return (
    <SignIn
      onSignedIn={handleSignedIn}
      onGoToSignUp={() => setView("signup")}
    />
  );
}

export default App;



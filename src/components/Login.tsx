import { FcGoogle } from "react-icons/fc";
// import { useFirebaseAuthentication } from "../hooks/useFirebaseAuthentication"
import useFirebaseAuthentication from "../backend/authentication";

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function LogIn({ onLoginSuccess }: LoginProps) {
  const { firebaseSignUp, firebaseSignIn, googleSignIn } =
    useFirebaseAuthentication();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const { id } = event.currentTarget;
    if (id === "btn-create-account") signUp();
    else if (id === "btn-sign-in") signIn();
    else if (id === "btn-sign-in-with-google") signInWithGoogle();
  }

  function getUserName(): string {
    const userNameEl = document.querySelector(
      "#input-user-name"
    ) as HTMLInputElement | null;

    if (!userNameEl) {
      return "";
    }

    const userName = userNameEl.value;
    clearInputFieldValue(userNameEl);
    return userName;
  }

  function getEmail(): string {
    const emailEl = document.querySelector(
      "#input-email"
    ) as HTMLInputElement | null;

    if (!emailEl) {
      return "";
    }

    const email = emailEl.value;
    clearInputFieldValue(emailEl);
    return email;
  }

  function getPassword(): string {
    const passwordEl = document.querySelector(
      "#input-password"
    ) as HTMLInputElement | null;

    if (!passwordEl) {
      return "";
    }

    const password = passwordEl.value;
    clearInputFieldValue(passwordEl);
    return password;
  }

  function clearInputFieldValue(element: HTMLInputElement) {
    element.value = "";
  }

  async function signUp() {
    const email = getEmail();
    const password = getPassword();
    const displayName = getUserName();

    await firebaseSignUp(email, password, displayName);
    onLoginSuccess?.();
  }

  async function signIn() {
    const email = getEmail();
    const password = getPassword();

    await firebaseSignIn(email, password);
    onLoginSuccess?.();
  }

  async function signInWithGoogle() {
    await googleSignIn();
    onLoginSuccess?.();
  }

  return (
    <>
      <section className="w-full max-w-[400px] mx-auto my-22">
        <div
          className="
          flex flex-col gap-4 
          p-2 justify-center
          font-Cabin 
          w-full
          "
        >
          <button
            id="btn-sign-in-with-google"
            onClick={handleClick}
            className="
            flex flex-wrap items-center justify-center gap-2
            py-4
            rounded-lg
            text-2xl
            shadow-md/50
            "
          >
            <FcGoogle />
            <span>Sign in with Google</span>
          </button>

          <input
            id="input-user-name"
            type="text"
            placeholder="Username"
            className="
            px-8 py-4 
            rounded-md
            text-2xl text-center
            border-2
            "
          />

          <input
            id="input-email"
            type="email"
            placeholder="Email"
            className="
            px-8 py-4 
            rounded-md
            text-2xl text-center
            border-2
            "
          />

          <input
            id="input-password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="
            px-8 py-4 
            rounded-md
            text-2xl text-center
            border-2
            "
          />
          <button
            id="btn-sign-in"
            onClick={handleClick}
            className="
            shadow-md/50
            px-8 py-4
            rounded-md
            text-2xl
            "
          >
            Sign in
          </button>

          <button
            id="btn-create-account"
            onClick={handleClick}
            className="
            shadow-md/50
            px-8 py-4
            rounded-md
            text-2xl
            "
          >
            Create Account
          </button>
        </div>
      </section>
    </>
  );
}

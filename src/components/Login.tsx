import { FcGoogle } from "react-icons/fc"

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth"
import type { AuthError } from "firebase/auth"
import { useAuth } from "../hooks/useAuth";

export default function LogIn() {
  const { auth, setUser, provider } = useAuth()

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const { id } = event.currentTarget
    if (id === "btn-create-account") signUp()
    else if (id === "btn-sign-in") signIn()
    else if (id === "btn-sign-in-with-google") signInWithGoogle()
  }

  function getUserName(): string {
    const userNameEl = document.querySelector(
      "#input-user-name"
    ) as HTMLInputElement | null

    if (!userNameEl) {
      return ''
    }

    const userName = userNameEl.value
    clearInputFieldValue(userNameEl)
    return userName
  }

  function getEmail(): string {
    const emailEl = document.querySelector(
      "#input-email"
    ) as HTMLInputElement | null

    if (!emailEl) {
      return ''
    }

    const email = emailEl.value
    clearInputFieldValue(emailEl)
    return email
  }

  function getPassword(): string {
    const passwordEl = document.querySelector(
      "#input-password"
    ) as HTMLInputElement | null

    if (!passwordEl) {
      return ''
    }
    
    const password = passwordEl.value
    clearInputFieldValue(passwordEl)
    return password
  }

  function clearInputFieldValue(element: HTMLInputElement) {
    element.value = ""
  }

  async function signUp() {
    const email = getEmail()
    const password = getPassword()
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      await updateProfile(user, {
        displayName: getUserName(),
      });

      // refresh and set user in context
      await user.reload()
      setUser({ ...user })
    }
    catch (error) {
      if (error instanceof Error) {
        const { code, message } = error as AuthError
        console.error(code)
        console.error(message)
      }
    }
  }

  async function signIn() {
    const email = getEmail();
    const password = getPassword();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user
      setUser({ ...user })
    } catch (error) {
      if (error instanceof Error) {
        const { code, message } = error as AuthError;
        console.error(code);
        console.error(message);
      }
    }
  }

  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider)
      // const credential = GoogleAuthProvider.credentialFromResult(result)
      // const token = credential?.accessToken
      const user = result.user
      // set user in context
      setUser({ ...user })
      // console.log(`[LOGIN] accessToken: ${token}`)
    }
    catch (error) {
      if (error instanceof Error) {
        const authError = error as AuthError
        const errorCode = authError.code
        const errorMessage = authError.message
  
        // const email = authError.customData.email
        // const credential = GoogleAuthProvider.credentialFromError(authError)
        console.error(errorCode)
        console.error(errorMessage)
        // console.error(email)
        // console.error(credential)
      }
    }
  }

  return (
    <>
      <section
        className="w-[90%] sm:w-[60%] md:w-1/2 h-screen"
      >
        <div
          className="
          flex flex-col gap-4 
          p-2 justify-center
          font-Cabin 
          w-full
          h-3/4
          "
        >
          <button
            id="btn-sign-in-with-google"
            onClick={handleClick}
            className="
            flex flex-wrap items-center justify-center gap-2
            py-2
            rounded-lg
            text-xl
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
            px-8 py-2 
            rounded-md
            text-xl text-center
            border-2
            "
          />

          <input
            id="input-email"
            type="email"
            placeholder="Email"
            className="
            px-8 py-2 
            rounded-md
            text-xl text-center
            border-2
            "
          />

          <input
            id="input-password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            className="
            px-8 py-2 
            rounded-md
            text-xl text-center
            border-2
            "
          />
          <button
            id="btn-sign-in"
            onClick={handleClick}
            className="
            shadow-md/50
            px-8 py-2
            rounded-md
            text-xl
            "
          >
            Sign in
          </button>

          <button
            id="btn-create-account"
            onClick={handleClick}
            className="
            shadow-md/50
            px-8 py-2
            rounded-md
            text-xl
            "
          >
            Create Account
          </button>
        </div>
      </section>
    </>
  );
}

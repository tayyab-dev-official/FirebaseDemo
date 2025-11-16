import {
    updateProfile
} from 'firebase/auth'
import type { AuthError } from "firebase/auth"

import { useAuth } from '../hooks/useAuth'

export default function Profile() {
    const { auth, user, setUser, setUpdateProfile } = useAuth()
    const userName = user?.displayName

    async function handleClick(event: React.MouseEvent) {
        const { id }= event.currentTarget

        if (id === "btn-profile-update") {
            try {
                if (user) {
                    const user = auth.currentUser
                    if (user) {
                        await updateProfile(user, {
                          displayName: getInputValue("#input-user-name"),
                          photoURL: getInputValue("#input-profile-picture"),
                        })
                        await user?.reload()
                        setUser(user)
                        setUpdateProfile(false)
                    }
                }
                else {
                    console.log('[Profile] User does not exist!')
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    const authError = error as AuthError
                    console.log('[PROFILE] unable to update profile!')
                    console.error(authError.code)
                    console.error(authError.message)
                }
            }
        }
    }

    function getInputValue(selector: string) {
        const inputEl: HTMLInputElement | null = document.querySelector(selector)
        if (!inputEl) {
            return ''
        }

        return inputEl.value
    }

    return (
      <>
        <h2>{userName ? userName : "User"} Profile</h2>

        <input
          id="input-user-name"
          type="text"
          placeholder="Username"
          className="
            px-8 py-2 
            rounded-md
            text-xl text-center
            border-2"
        />

        <input
          id="input-profile-picture"
          type="text"
          placeholder="Photo URL"
          className="
            px-8 py-2 
            rounded-md
            text-xl text-center
            border-2"
        />

        <button
          id="btn-profile-update"
          onClick={handleClick}
          className="
            shadow-md/50
            px-8 py-2
            rounded-md
            text-xl
            "
        >
          Update profile
        </button>
      </>
    );
}
import { useAppContext } from '../hooks/useAppContext'

export default function Profile() {
    const { 
      currentUser,
      setIsUpdateUserProfile,
      updateUserProfile } = useAppContext();
    const userName = currentUser?.displayName

    async function handleClick(event: React.MouseEvent) {
        const { id }= event.currentTarget

        if (id === "btn-profile-update") {
            const displayName = getInputValue("#input-user-name")
            const photoURL = getInputValue("#input-profile-picture")

            if (currentUser) {
              await updateUserProfile(
                currentUser,
                {displayName, photoURL}
              );
            }
            setIsUpdateUserProfile(false);
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
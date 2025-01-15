export const useCompendiumProfile = () => {
    const {id, db, lookup} = useInstantDB()
    const $auth = useInstantAuth()

    const profile = useState('profile')

    const getProfile = () => {
        if (!$auth.userValid.value || $auth.user.value?.id == undefined) return
        return db.useQuery({
            profiles: {
                $: {
                    where: {
                        'owner.id': $auth.user.value.id
                    }
                },
                galleries: {},
                avatar: {},
                owner: {},
            }
        })
    }

    const waitProfile = async (force: boolean = false) => {
        await $auth.waitAuth()
        if(!force || !!profile.value) return profile.value
        if (!$auth.userValid.value || $auth.user.value?.id == undefined) return
        const {data: user} = await db.queryOnce({
            profiles: {
                $: {
                    where: {
                        'owner.id': $auth.user.value.id
                    }
                },
                galleries: {},
                avatar: {},
                owner: {},
            }
        })
        profile.value = user.profiles[0]
    }

    const isSiteOwner = async () => {
        await waitProfile()
        const {data, isLoading} = db.useQuery({
            galleries: {

            }
        })
        await until(isLoading).toBe(false)
        console.log(data.value)
        return data.$users[0]?.id == profile.value?.owner?.id
    }

    return {
        getProfile,
        waitProfile,
        profile,
        isSiteOwner
    }
}
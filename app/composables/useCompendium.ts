export const useCompendium = () => {
    const {db, id} = useInstantDB()
    const getGalleries = () => {
        return db.useQuery({
            galleries: {
                owner: {},
                media: {}
            }
        })
    }

    const getGalleriesLimit = async (first: number = 10, after: any = null) => {
        return db.queryOnce({
            galleries: {
                $: {
                    order: {
                        updated_at: 'desc'
                    },
                    first: first,
                    after: after,
                },
                owner: {},
                media: {
                    content: {}
                }
            }
        })
    }

    return {
        getGalleries,
        getGalleriesLimit
    }
}
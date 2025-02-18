import { useAuth } from "../context/AuthContext"
import useAxios from "./useAxios"

export const getUserProfile = () => {
    const { fetchData } = useAxios()
    const { setLoggedInUser, setMyDetails } = useAuth()

    const getUser = async (token) => {
        try {

            const { data, status } = await fetchData({
                url: '/api/users/profile',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log('userDetails', data, status)
            if (status) {
                setLoggedInUser(data)
                setMyDetails(JSON.stringify(data))
            }
            return {
                data, status
            }

        } catch (error) {
            console.log('usersDetails Error', error)
        }
    }
    return {getUser}
}
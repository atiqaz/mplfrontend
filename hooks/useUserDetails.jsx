
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import useAxios from '../helper/useAxios'
import { useAuth } from '../context/AuthContext'
import { useMMKVString } from 'react-native-mmkv'

export default function useUserDetails(msg) {

    const { fetchData } = useAxios()
    const { userToken ,mydetails, setMyDetails,loggedInUser,setLoggedInUser } = useAuth()

    

    const getMe = async (token) => {
        console.log('api got called atiq',token)
        try {

            const {data,status} = await fetchData({
                url: '/api/users/profile',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log('userDetails',data, status)
            if(status){
                setLoggedInUser(data)
                setMyDetails(JSON.stringify(data))
            }

        } catch (error) {
console.log('usersDetails Error',error)
        }
    }



const userDetails=mydetails
    return {userDetails ,getMe}
}


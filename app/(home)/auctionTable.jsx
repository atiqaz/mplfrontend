
'use client';
import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import NoStartedPage from '../../components/NostStarted'
import AuctionTableScreen from '../../components/BidWar'
import { getUserDetails } from '../../helper/Storage'
import ListsAuctions from '../../components/ListsAuctions'
import { useAuth } from '../../context/AuthContext'
import { Button } from 'react-native-paper'
import { usePathname, useRouter } from 'expo-router'
import PullToRefreshLayout from '../../components/layout/PullToRefreshLayout';
import RefreshLayout from '../../helper/RefreshLayout';
import { useData } from '../../context/useData';

export default function auctionTable() {
    // const [started, setStarted] = useState(false)
    const { userRole, mydetails } = useAuth()
    const {started, setStarted,
        selectedInternalAuction, setselectedInternalAuction}=useData()
    // const [selectedInternalAuction, setselectedInternalAuction] = useState(null);
    const [text, setText] = useState('')
    console.log('renderd')
    console.log({ userRole })
    const router = useRouter();
    const pathname = usePathname();

    const refresh = () => {
        setText(Math.random() * 10)
        router.replace(pathname)
    }
    return (
        <>{
            started ? (
                <>
                    <AuctionTableScreen auctionDetails={selectedInternalAuction} />
                </>) :
                <>
                {
                    userRole === "admin" ? <>
                        <ListsAuctions setStarted={setStarted} setselectedInternalAuction={setselectedInternalAuction} selectedInternalAuction={selectedInternalAuction} />
                    </> : <>

                        <NoStartedPage setStarted={setStarted} selectedInternalAuction={selectedInternalAuction} setselectedInternalAuction={setselectedInternalAuction} />
                    </>
                }</>
        }

        </>
    )
}

const styles = StyleSheet.create({})
export const StatusColors =(status)=>{
 switch(status){
     case 'InProgress':
         return 'green'
     case 'Completed':
         return 'red'
     case 'Pending':
         return 'orange'
     default:
         return 'black'
 }
}

export const isAuctionJoined =(userDetails, auctionId)=>{
 
    if(userDetails){
        const auctions = userDetails.auctions
        // console.log(`auctions`,userDetails.auctions)
        if(auctions.length){
            // console.log(auctionId)
            const is = auctions.some(auction=>auction.auctionId._id===auctionId._id)
           return is
        }
    }

}
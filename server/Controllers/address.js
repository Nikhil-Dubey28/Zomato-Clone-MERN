const Address = require('../Models/Address')

const createAddress = async (req,res) => {
    try {

        const userId = req.userId
        const {addressTitle, flat,area,landmark,city,state,pincode} = req.body 
    
    const address =  new Address({
        addressTitle,
        flat,
        area,
        landmark,
        city,
        state,
        pincode,
        user: userId
    })
    
    await address.save()
   


    return res.status(201).json(address)
    }catch(error) {
        console.log(error)
        return res.status(500).json({ error: 'internal server error', message: error.message });
    }



}

const getAddress = async (req,res) => {
    try {
        const userId = req.userId
        const addresses = await Address.find({user : userId})
        const emptyAddress = {}
        if(addresses.length > 0) {
            return res.status(200).json(addresses)
        }else {
            return res.status(404).json({ message: 'Address not found'})
        }
    }catch(error) {
        console.log(error)
        return res.status(500).json({ error: 'internal server error', message: error.message });
    }
}


const editAddress  =  async(req,res) => {
    try {
        const userId  = req.userId
      
        const { addressId, addressTitle, flat, area, landmark, city, state, pincode } = req.body;

         // Find the address by ID and check if it belongs to the user
         const address = await Address.findOneAndUpdate(
            { _id: addressId, user: userId },
            { addressTitle, flat, area, landmark, city, state, pincode },
            { new: true }
        );

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        return res.status(200).json(address);
    }catch(error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error', message: error.message });
    }
}


const deleteAddress = async(req,res) => {
    try{    
       const userId = req.userId
    const {addressId} = req.params  

    const address = await Address.findByIdAndDelete({_id: addressId})

    if(!address) {
        return res.status(404).json({message: "address not found"})
    }


    return res.status(200).json({message: "address deleted successfully"})
    }catch(error) {
        console.log(error);
        return res.status(500).json({ error: 'internal server error', message: error.message });
    }
}




module.exports = {
    createAddress,
    getAddress,
    editAddress,
    deleteAddress
}
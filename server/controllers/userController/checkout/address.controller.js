import { User } from '../../../mongodb/models/user.model.js';

const getAddress = async(req,res)=>{
    const { id } = req.user;

    try{
        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        return res.status(201).json({ success: true, data: user.addresses });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

const addAddress = async(req, res)=>{
    const { id } = req.user;
    const { newAddress, isDefault } = req.body;
    try{
        const user = await User.findById(id);
        user.addresses.addressList.push(newAddress);
        if(isDefault || user.addresses.addressList.length==1){
            user.addresses.defaultAddressIndex = user.addresses.addressList.length - 1
        }

        await user.save();

        return res.status(201).json({ success: true, data: user.addresses });
       
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

const editAddress = async(req,res) => {
    const { id } = req.user;
    const { address, ai, isDefault } = req.body;
    console.log(req.body)
    try{
        const user = await User.findById(id);
        user.addresses.addressList[ai] = address;
        if(isDefault){
            user.addresses.defaultAddressIndex = ai
        };

        await user.save();

        return res.status(201).json({ success: true, data: user.addresses });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
};

const removeAddress = async(req,res) => {
    const { id } = req.user;
    const { ai } = req.body;
    try{
        const user = await User.findById(id);
        user.addresses.addressList.splice(ai,1);
        if(user.addresses.defaultAddressIndex==ai){
            if(user.addresses.addressList.length>=1){
                user.addresses.defaultAddressIndex = 0
            }else{
                user.addresses.defaultAddressIndex = -1
            }
        }
        await user.save()

        return res.status(200).json({ success: true, data: user.addresses });
    }catch(err){
        return res.status(500).json({ success: false, message: err.message });
    }
}

export { getAddress, editAddress, addAddress, removeAddress };
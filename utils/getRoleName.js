const Roles = require('../models/roles');

const role_name = async(role_id)=>{
    try{
        let role;
        return  role = Roles.findOne({
            where : {ID : role_id}
    })
}catch(e){
    console.log(`Error in getting role name`, e)
}
 
}

module.exports=role_name
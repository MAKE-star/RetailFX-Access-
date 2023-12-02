const User = require('../models/user');

const userActive = async(username)=>{
  
        const in_active = await User.update({
            IS_ACTIVE : 1
        }, {where: {USERNAME:username}})

        return in_active
}

module.exports = userActive;
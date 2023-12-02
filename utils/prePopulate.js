const Product = require('../models/product');

const tradeRefCcy = async(product)=>{
        const getProduct = await Product.findOne({
            where : {PRODUCT_TYPE: product}
        })
        console.log()
        return getProduct.REF_CCY
    
}

module.exports = {
    tradeRefCcy
}

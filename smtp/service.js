const { request } = require('express');
const Smtp = require('../models/smtp');
const { response } = require('../product/route');
const uuid = require('uuid').v4;

const createSMTP = async(request, response) => {
    try{
        await Smtp.create({
            ID: uuid(),
            SERVICE:request.body.service,
            USER: request.body.user,
            PASSWORD:request.body.password,
            FROM:request.body.from,
            SUBJECT:request.body.subject,
        })
    return response.status(200).send({
        "message" : "SMTP details saved!"
    })
    }catch(error){
        console.error('Error in SMTP create', error);
        return response.status(400).send({
            "message" : "Error!"
        })
    }

}

const getAllSMTP = async(request,response)=>{
    try{
    const smtps = await Smtp.findAll();
    return response.status(200).json(smtps);
    } catch(error){
        console.error('Error in Get all SMTP', error);
        return response.status(400).send({
            "message" : "Error!"
        });
    }
}

const getSMTP = async(request, response)=>{
    try{
        const smtp = await Smtp.findOne({
            where : {ID : request.params.id}
        });
        if(!smtp.id){
            return response.status(404).send({
                "message" : " Kindly Provide Valid details"
            })
        }
        return response.status(200).json(smtp);
    }catch(e){
        console.error('Error in get SMTP by id', e);
        return response.status(400).send({
            "message" : "Error!"
        })
    }
}
const updateSMTP = async(request, response) => {
    try{
        const smtp= await Smtp.update({
            SERVICE:request.body.service,
            USER: request.body.user,
            PASSWORD:request.body.password,
            FROM:request.body.from,
            SUBJECT:request.body.subject,
            UPDATED_AT : new Date()
        },{where : {ID: request.params.id}})
        if(!smtp.id){
            return response.status(404).send({
                "message" : " Kindly Provide Valid details"
            })
        }
    return response.status(200).send({
        "message" : "SMTP details updated!"
    })
    }catch(error){
        console.error('Error in SMTP Update');
        return response.status(400).send({
            "message" : "Error!"
        })
    }

}

const deleteSMTP = async(request,response) =>{
    try{
    const smtp = await Smtp.findOne({
        where : {ID : request.params.id}
    });
    await smtp.destroy();
    if(!smtp.id){
        return response.status(404).send({
            "message" : " Kindly Provide Valid details"
        })
    }
    return response.status(200).send({
        "message":"STMP deleted"
    });
}catch(e){
    console.error('Error in delete SMTP', e);
    return response.status(400).send({
        "message" : "Error!"
    })
}
}

module.exports= {
    createSMTP,
    getAllSMTP,
    getSMTP,
    updateSMTP,
    deleteSMTP
}
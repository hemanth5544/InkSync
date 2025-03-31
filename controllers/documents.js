const Documents = require("../models/documents")
const Users = require("../models/users")
const Invitations = require("../models/invitations")
const crypto = require("crypto")
const nodemailer = require("nodemailer")





const CreateDocument = async (req,res) => {
    try {
        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const document = await Documents.findOne({document_id})
        if(!document){
            const document = await new Documents({
                document_id,
                document_creator : req.user.id,
            }).save()
            
            const user = await Users.findOne({_id:req.user.id})

            document.document_contributors.push({
                contributor_id : user._id,
                role : "creator",
            })
            await document.save()

            user.shared_documents.push({
                document_id : document_id,
                role : "creator",
            })
            await user.save()

            return res.status(200).json({
                status : 200,
                successful : true,
                message : "new document has been created"
            }) 
        }

        return res.status(200).json({
            status : 200,
            successful : true,
            message : "document already exists"
        }) 

    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}


const FindDocument = async (req,res) => {
    try {
        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const document = await Documents.findOne({document_id})
            .populate("document_contributors.contributor_id" , "username email")
            .populate("document_creator" , "username email")

    
        return res.status(200).json({
            status : 200,
            successful : true,
            document
        }) 

    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}


const FindDocuments = async (req,res) => {
    try {

        const documents = await Documents.find({
            $or : [
                {document_creator : req.user.id},
                {"document_contributors.contributor_id" : req.user.id}
            ]
        })
        .populate("document_contributors.contributor_id" , "username email")
        .populate("document_creator" , "username email")

    
        return res.status(200).json({
            status : 200,
            successful : true,
            documents
        }) 

    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}


const UpdateDocumentContent = async (req,res) => {
    try {
        const document_id = req.params.document_id
        if(!document_id){
            return res.status(400).json({
                status : 400,
                successful : false,
                message : "document_id parameter is not provided"
            }) 
        }

        const content = req.body.content
        const document = await Documents.findOneAndUpdate(
            { document_id : document_id}, 
            { $set: { document_content: content } },
            { runValidators: true } 
        );

        if(!document){
            return res.status(404).json({
                status : 404,
                successful : false,
                message : "document not found!"
            })   
        }

        return res.status(200).json({
            status : 200,
            successful : true,
            message : "document has been updated"
        })
        
    } catch (error) {
        console.log(error);
        return res.json(error)
    }
}


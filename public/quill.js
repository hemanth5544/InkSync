const urlParams = new URLSearchParams(window.location.search);
let documentId = urlParams.get("document_id");

if (!documentId) {
    documentId = uuid.v4();
    const newUrl = `${window.location.pathname}?document_id=${documentId}`;
    window.history.pushState(null, '', newUrl);
}




const CreateDocument = async () => {
    await fetch(`/api/documents/create/${documentId}`)
}


const FindDocument = async () => {
    const response = await fetch(`/api/documents/${documentId}`)
    const data = await response.json()
    if(data.document){
        quill.setContents(data.document.document_content) 
    }
}


const UpdateDocumentContent = async (content) => {
    await fetch(`/api/documents/${documentId}`,{
        method : "PUT",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({content})
    })
}


const saveDocumentBtn = document.getElementById("saveDocumentBtn")
saveDocumentBtn.addEventListener("click",(e) => {
    documentName = document.getElementById("documentName").value
    SaveAsDocument(documentName)
})


const SaveAsDocument = async (name) => {
    await fetch(`/api/documents/saveAs/${documentId}`,{
        method : "PUT",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({name})
    })
}



const inviteBtn = document.getElementById("inviteBtn")
inviteBtn.addEventListener("click",async (e) => {
    email = document.getElementById("email").value
    role = document.getElementById("role").value

    await fetch(`/api/documents/SendInvitation/${documentId}`,{
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({email,role})
    })
})



const GetUserRole = async () => {
    const response = await fetch(`/api/documents/GetUserRole/${documentId}`)
    const data = await response.json()
    return data.role
}


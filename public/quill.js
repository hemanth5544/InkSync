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


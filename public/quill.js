const urlParams = new URLSearchParams(window.location.search);
let documentId = urlParams.get("document_id");

if (!documentId) {
    documentId = uuid.v4();
    const newUrl = `${window.location.pathname}?document_id=${documentId}`;
    window.history.pushState(null, '', newUrl);
}


const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
        // Match theme
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            toast.style.background = '#343a40';
            toast.style.color = '#f8f9fa';
        }
    }
});
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
    try {
        const response = await fetch(`/api/documents/saveAs/${documentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });
        if (response.ok) {
            Toast.fire({
                icon: 'success',
                title: 'Document saved successfully!'
            });
            const saveAsModal = bootstrap.Modal.getInstance(document.getElementById('saveAsModal'));
            saveAsModal.hide();
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Failed to save document'
            });
        }
    } catch (error) {
        Toast.fire({
            icon: 'error',
            title: 'An error occurred'
        });
    }
};



const inviteBtn = document.getElementById("inviteBtn");
inviteBtn.addEventListener("click", async (e) => {
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;

    try {
        const response = await fetch(`/api/documents/SendInvitation/${documentId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, role })
        });
        if (response.ok) {
            Toast.fire({
                icon: 'success',
                title: 'Invitation sent successfully!'
            });
            const inviteModal = bootstrap.Modal.getInstance(document.getElementById('inviteModal'));
            inviteModal.hide();
            GetDocumentContributors();
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Failed to send invitation'
            });
        }
    } catch (error) {
        Toast.fire({
            icon: 'error',
            title: 'An error occurred'
        });
    }
});



const GetUserRole = async () => {
    const response = await fetch(`/api/documents/GetUserRole/${documentId}`)
    const data = await response.json()
    return data.role
}


const UiElementsAcessControl = async () => {
    const UserRole = await GetUserRole()
    //ui elements
    const invite_btn = document.getElementById("invite-btn")
    const save_as_btn = document.getElementById("save-as-btn")


    if(UserRole !== "creator" && UserRole !== "editor"){
        invite_btn.disabled = true;
    }

    if(UserRole !== "creator" && UserRole !== "editor"){
        save_as_btn.disabled = true;
    }
    
}


const CanWrite = async () => {
    const AllwedRoles = ["creator","editor"]
    const UserRole = await GetUserRole()
    
    if(!AllwedRoles.includes(UserRole)){
        quill.disable()
    }
}


const GetDocumentContributors = async () => {
    const response = await fetch(`/api/documents/GetDocumentContributors/${documentId}`)
    const data = await response.json()
    
    const user_list = document.getElementById("user-list")
    data.document_contributors.forEach(contributor => {
        const holder = `
                <div class="user-list-item hover:bg-gray-50">
                    <img src="${contributor.contributor_id.user_avatar}" alt="User 1" class="user-avatar">
                    <div class="user-info">
                        <div class="font-semibold">${contributor.contributor_id.email}</div>
                        <div class="text-gray-500 text-sm">${contributor.role}</div>
                    </div>
                </div>
            </div>`

            user_list.innerHTML += holder
    });
}



quill.on("text-change",(delta, oldDelta, source) => {
    if(source === "user"){
        const content = quill.getContents()
        UpdateDocumentContent(content)
    }
})






CreateDocument()
FindDocument()
CanWrite()
UiElementsAcessControl()
GetDocumentContributors()
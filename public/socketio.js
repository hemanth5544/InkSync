const socket = io("https://inksync-gjzj.onrender.com")


socket.emit("join_document",documentId)


quill.on("text-change",(delta, oldDelta, source) => {
    if(source === "user"){
        socket.emit("emit_delta",delta,documentId)
    }
})


socket.on("brodcast_delta",delta => {
    quill.updateContents(delta)
})
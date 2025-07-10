
const renderLog = (message: string) : void => {
    const logBox = document.getElementById("log");
    const logMessage = document.createElement("div");
    logMessage.classList.add("log-message");
    logMessage.textContent = message;

    if (logBox === null) {
        console.log("logBox is null");
        return;
    }

    while(logBox.children.length > 6){
        logBox.removeChild(logBox.firstChild!);
    }
    
    logBox.appendChild(logMessage);
    logBox.scrollTop = logBox.scrollHeight;
}

const renderStorage = (id: string) : void => {
    const element = document.getElementById(id);

    if (element === null) {
        console.log("This element doesn't exist " + id);
        return;
    }

    element?.style.removeProperty("display");
}

export default {
    renderLog,
    renderStorage,
}
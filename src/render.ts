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

const renderUnlocked = (id: string) : void => {
    const element = document.getElementById(id);
    element ? element?.style.removeProperty("display") : console.log("This element doesn't exist " + id);

}

const renderStorageValue = (id: string, value : number) : void => {
    const element = document.getElementById(id + "-count");
    element ? element.textContent = value.toString() : console.log("This element doesn't exist " + id);
}

export default {
    renderLog,
    renderUnlocked,
    renderStorageValue
}
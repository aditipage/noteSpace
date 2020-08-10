const electron = require("electron")
const ipc = electron.ipcRenderer
const shell = require('electron').shell;
const errbtn = document.getElementById("errorbtn")
errbtn.addEventListener('click',function(){
    ipc.send('openFile', () => { 
        console.log("Event sent."); 
     })}) 
ipc.on('fileData', (event, data,msg) => { 
        //document.write(data)
        console.log("here i came")
        ipc.send('senddata',data)
        //document.writeln(msg) 
     })

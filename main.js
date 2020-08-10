console.log("Process is running");
const electron = require("electron");
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const ipcMain = electron.ipcMain;
const dialog =electron.dialog;
const Menu = electron.Menu;
const MenuItem = electron.MenuItem
const globalShortcut = electron.globalShortcut;
const {PythonShell} = require("python-shell");
let winone,wintwo,choosingWindow;
const PDFWindow = require('electron-pdf-window'); 
function createWindow(){
    
    winone = new BrowserWindow({width: 900,height: 1024,x:0,y:0,frame:true});
    choosingWindow = new BrowserWindow({width: 600,height: 600,x:750,y:200});
    //wintwo = new BrowserWindow({width: 900,height: 1024,x:0,y:0});   
    //we can add modal window, parent-child window depending on the need
    winone.on('closed', () =>{
           winone = null;
       })
    choosingWindow.loadURL(url.format(
        { 
            pathname: path.join(__dirname,'index.html'),
             protocol: 'file',
             slashes:true
        }));
        
       
    winone.loadURL(url.format(
        { 
            pathname: path.join(__dirname,'temp.html'),
             protocol: 'file',
             slashes:true
        }));
        
   /* pdfwin.loadURL(url.format(
        { 
                pathname: path.join(__dirname,'index.html'),
                protocol: 'file',
                slashes:true
        }));
     */  
      
    /*wintwo.on('closed', () =>{
        wintwo = null;
    })*/
    
}

ipcMain.on('openFile', (event, path) => {  
    const fs = require('fs') 
    dialog.showOpenDialog({
        properties: ['openFile'], // set to use openFileDialog
         
    }, (fileNames) =>{ 
        
       // fileNames is an array that contains all the selected 
       if(fileNames === undefined) { 
          console.log("No file selected"); 
       
       } else {
         msg = fileNames;
         //var subpy = require("child_process").spawn("python", [ "./trial3.py msg" ])
         
         var options = {
            scriptPath: __dirname,
            args: [msg]
        }

         PythonShell.run('trial3.py', options, function  (err, results)  {
            if  (err)  throw err;
            console.log('trial3.py finished.');
            console.log('results', results);
           });
        
         console.log("here");
        
        var rp = require( "request-promise" );
          readFile('tempfinal2.txt');
        openPDf();
        
       } 
    });
    
    function readFile(filepath) { 
       fs.readFile(filepath, 'utf-8', (err, data) => { 
          
          if(err){ 
             alert("An error ocurred reading the file :" + err.message) 
             return 
          } 
        
          // handle the file content 
         event.sender.send('fileData', data,'tempfinal2.txt')
          
       }) 
    } 
 })  
app.on('ready', function(){
    createWindow()
        

    const template = [
        {
            label: 'demo',
            submenu: [
                {
                label: 'submenu1',
                click: function(){
                    console.log("CLicked submenu 1")
                }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'submenu2'
                }
            ]
        },
        {
            label:'Help',
            submenu: [{
                label: 'About electron',
                click:function(){
                    electron.shell.openExternal('https://www.google.com/')
                    
                },
                accelerator: 'CmdOrCtrl + Shift + H'
            }
        ]
        },
        {
            label : 'Edit',
            submenu: [
                    { role: 'undo'},
                    { role: 'redo'},
                    { role: 'separator'},
                    { role: 'cut'},
                    { role: 'copy'},
                    { role: 'paste'},
                    { role: 'selectall'},
                
            ]
        }
    ]

   // const menu = Menu.buildFromTemplate(template)
    //Menu.setApplicationMenu(menu) 
    
    const ctxMenu = new Menu();
    ctxMenu.append(new MenuItem({
        label : 'Hello',
        click : function(){
            console.log("Context menu clicked")
        }
    }))
    ctxMenu.append(new MenuItem({ role: 'selectall'}))

    winone.webContents.on('context-menu',function(e,params){
        ctxMenu.popup(winone,params.x,params.y)
    })
    globalShortcut.register('Alt + 1',function(){
        winone.show()
    })
})
ipcMain.on('senddata',function(e,item){
    console.log("send data successful")
    winone.webContents.send('senddata',item);
    choosingWindow.close();  
});
ipcMain.on('senditem',function(e,item){
    console.log(item)
    wintwo.webContents.send('senditem',item);
});
function openPDf(){
    wintwo = new BrowserWindow({width: 900,height: 1024,x:900,y:0});
    //console.log(msg)
    //var msg_new = msg.toString();
    
    //console.log(path.format(msg));
    wintwo.loadURL(url.format(
        { 
                pathname: path.join(__dirname,'result.html'),
                protocol: 'file',             
        }));
    
    //console.log(data);
      //  choosingWindow.close();  
}

app.on('window-all-closed', () =>{
    if(process.platform !== "darwin"){
        app.quit();
    }
});
app.on('will-quit',function(){
    globalShortcut.unregiserAll()
})

app.on('activate', () =>{
    if(win=== null){
        createWindow();
    }
});

const electron = require('electron');
const { app, Menu, Tray } = electron;
const { BrowserWindow } = electron;
const path = require('path');

let win;
let tray = null
function createWindow() {
  // 创建窗口并加载页面
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icon.ico'),
    // useContentSize: true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  });
  win.loadURL(`file://${__dirname}/index.html`);

  // 打开窗口的调试工具
  win.webContents.openDevTools();
  // win.setMenu(null)
  // 窗口关闭的监听  
  win.on('closed', (event) => {
    win = null;
  });
  // 当我们点击关闭时触发close事件，我们按照之前的思路在关闭时，隐藏窗口，隐藏任务栏窗口
  // event.preventDefault(); 禁止关闭行为(非常必要，因为我们并不是想要关闭窗口，所以需要禁止默认行为)
  win.on('close', (event) => { 
      win.hide(); 
      win.setSkipTaskbar(true);
      event.preventDefault();
  });
  win.on('show', () => {
    // tray.setHighlightMode('always')
  })
  win.on('hide', () => {
    // tray.setHighlightMode('never')
  })
  //创建系统通知区菜单
  tray = new Tray(path.join(__dirname, 'icon.ico'));
   const contextMenu = Menu.buildFromTemplate([
      {label: '退出', click: () => {win.destroy()}},//我们需要在这里有一个真正的退出（这里直接强制退出）
    ])
    tray.setToolTip('My托盘测试')
    tray.setContextMenu(contextMenu)
    tray.on('click', ()=>{ //我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
        win.isVisible() ? win.hide() : win.show()
        win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true);
    })
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

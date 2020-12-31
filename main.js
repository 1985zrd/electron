const { app, BrowserWindow } = require('electron')
const { Tray, Menu, ipcMain} = require('electron')
const path = require('path')

let tray = null

function createWindow () {
  let win = null
  win = new BrowserWindow({
    width: 900,
    height: 600,
    useContentSize: true,
    frame: false,
    // backgroundColor: '#8a8787',
    icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  win.on('closed', () => {
    win = null 
  })
  win.on('close', event => {
    win.hide()
    win.setSkipTaskbar(true)
    event.preventDefault()
  })
  win.loadFile('index.html')
  // 打开 开发者工具
  // win.webContents.openDevTools()
  // 主进程,主动发送消息到渲染进程
  setTimeout(() => {
    win.webContents.send('main-message', '主进程的第一个消息')
  }, 1000)
  // 创建一个系统托盘
  tray = new Tray(path.join(__dirname, 'favicon.ico'))
  // 创建一个菜单
  const contextMenus = Menu.buildFromTemplate([
    {
      label: '退出', click: () => win.destroy()
    }
  ])
  // 托盘添加一个右键菜单
  tray.setContextMenu(contextMenus)
  tray.on('click', () => {
    if (win.isVisible()) {
      win.hide()
      win.setSkipTaskbar(true)
    } else {
      win.show()
      win.setSkipTaskbar(false)
    }
  })
}
// 创建一个渲染进程
function createWindows () {
  let win = null
  win = new BrowserWindow({
    width: 900,
    height: 600
  })
  win.on('closed', () => {
    win = null
  })
  win.loadFile('index.html')
}

// 主进程监听 渲染进程消息
ipcMain.on('page-message', (e, data) => {
  console.log(data)
  setTimeout(() => {
    e.reply('main-message', '主进程回复的消息')
  }, 1000)
})

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  app.quit()
})

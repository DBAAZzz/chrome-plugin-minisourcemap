const decompress = require('decompress')
const https = require('https')
const fs = require('fs')
const { rename, stat, unlink } = require('fs/promises')
const { exitsFolder, fileResolve, deleteDir, mapDir } = require('./file')

const getSourceMap = function (cookie, dirId) {
  return new Promise((resolve, reject) => {
    var req = https.get('https://wedata.weixin.qq.com/mp2/cgi/reportdevlog/GetSourceMapDownload?index=0', {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
        "cookie": cookie
      }
    }, function (res) {

      const zipFilePath = fileResolve('../zipFileDownload.zip')
      const writeStream = fs.createWriteStream(zipFilePath)

      res.on('data', function (chunk) {
        writeStream.write(chunk)
      })

      res.on('end', function (chunk) {
        writeStream.end(chunk)
      })

      writeStream.on('finish', async () => {
        try {
          const decompressFolderPath = fileResolve(`../contents/${dirId}`) // decompress folder
          await decompress(zipFilePath, decompressFolderPath)
          const sourceMapFolder = fileResolve(`../mapFile/${dirId}`)
          await exitsFolder(sourceMapFolder)
          await deleteDir(sourceMapFolder)
          mapDir(decompressFolderPath, async (pathName, fileName) => {
            if (!fs.existsSync(`${sourceMapFolder}/${fileName}`)) {
              rename(pathName, `${sourceMapFolder}/${fileName}`)
              return
            }
            try {
              const oldStats = await stat(pathName)
              const newStats = await stat(`${sourceMapFolder}/${fileName}`)
              if (oldStats.size > newStats.size) {
                await rename(pathName, `${sourceMapFolder}/${fileName}`)
              }
            } catch (error) {
              console.error('error1', error)
            }
          })
          await unlink(zipFilePath)

          resolve()
        } catch (error) {
          console.error('error2', error)
        }
      })

    }).on('error', function (e) {
      console.log('error: ' + e.message)
      reject()
    })

    req.end()
  })
}



module.exports = {
  getSourceMap
}
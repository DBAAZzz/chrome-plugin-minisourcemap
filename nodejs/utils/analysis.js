const sourceMap = require('source-map')
const Stacktracey = require('stacktracey')
const fs = require('fs')
const path = require('path')

const readFile = (filePath) => new Promise((resolve, reject) => {
  fs.readFile(filePath, { flag: 'r' }, (err, data) => {
    if (err) reject(err)
    else resolve(data.toString())
  })
})

const analysis = async (errorStack, id) => {
  // 读取Source Map文件， 直接读取dist目录下对应的map文件，真实情况是需要上传至服务器的
  const tracey = new Stacktracey(errorStack)

  // 过滤系统报错
  const errorInfo = tracey.items.find(item => {
    return !(['WASubContext.js', 'WAServiceMainContext.js'].includes(item.fileName))
  }) || tracey.items[0]

  let { fileName } = errorInfo
  fileName = fileName.indexOf('appservice') != -1 ? fileName.replace('.js', '.map') : fileName.replace('.js', '.appservice.map')
  let sourceMapFileName = `../mapFile/${id}/app-service.map.map`
  if (fs.existsSync(path.resolve(__dirname, `../mapFile/${id}/${fileName}.map`))) {
    sourceMapFileName = `../mapFile/${id}/${fileName}.map`
  }

  console.log('path.resolve(__dirname, sourceMapFileName)', path.resolve(__dirname, sourceMapFileName))
  const sourceMapFileContent = await readFile(path.resolve(__dirname, sourceMapFileName))
  // 解析错误栈信息
  const sourceMapContent = JSON.parse(sourceMapFileContent);

  try {
    // 根据source map文件创建SourceMapConsumer实例
    const consumer = await new sourceMap.SourceMapConsumer(sourceMapContent);

    // 根据打包后代码的错误位置解析出源码对应的错误信息位置
    const originalPosition = consumer.originalPositionFor({
      line: errorInfo.line,
      column: errorInfo.column,
    });

    // 获取源码内容
    const sourceContent = consumer.sourceContentFor(originalPosition.source);

    console.log('originalPosition', originalPosition)

    // 返回解析后的信息
    return {
      sourceContent,
      ...originalPosition
    }
  } catch (error) {
    console.log('error', error)
    return Promise.reject(error)
  }
}

module.exports = analysis

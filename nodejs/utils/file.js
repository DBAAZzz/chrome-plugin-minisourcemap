const { stat, mkdir, unlink, rmdir, readdir } = require('fs/promises')
const path = require('path')

const fileResolve = function (dir) {
  return path.join(__dirname, dir)
}

/**
 * 传入文件夹的路径看是否存在，存在不用管，不存在则直接创建文件夹
 * @param absPath {String} 文件路径
 * @returns {Promise<boolean>}
 */
const exitsFolder = async function (absPath) {
  try {
    await stat(absPath)
  } catch (e) {
    // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
    await mkdir(absPath, { recursive: true })
  }
}

/**
 * 遍历指定目录下的所有文件夹
 * @param {string} dir 
 * @param {function} callback 
 * @param {function} finish 
 * @param {array} ignoreType
 */
const mapDir = async function (dir, callback, finish, ignoreType = []) {
  try {
    const files = await readdir(dir)
    files.forEach(async (filename, index) => {
      let pathname = path.join(dir, filename)
      // 读取文件信息
      const stats = await stat(pathname)
      if (stats.isDirectory()) {
        mapDir(pathname, callback, finish)
      } else if (stats.isFile()) {
        if (ignoreType.includes(path.extname(pathname))) {
          return
        }
        callback && callback(pathname, filename)
        if (index === files.length - 1) {
          finish && finish()
        }
      }
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * 遍历删除文件夹下面的文件
 * @param {string} path 
 */
const deleteDir = async function (path) {
  const files = await readdir(path)
  files.forEach(async file => {
    const filePath = `${path}/${file}`;
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      deleteDir(filePath);
    } else {
      await unlink(filePath);
    }
  });
}

/**
 * 遍历删除文件夹
 * @param {string} path 
 * @param {number} level 
 */
const rmEmptyDir = async function (path, level = 0) {
  const files = await readdir(path);
  if (files.length > 0) {
    let tempFile = 0;
    files.forEach(async file => {
      tempFile++;
      rmEmptyDir(`${path}/${file}`, 1);
    });
    if (tempFile === files.length && level !== 0) {
      await rmdir(path);
    }
  }
  else {
    level !== 0 && rmdir(path);
  }
}

const clearDir = function (path) {
  deleteDir(path)
  rmEmptyDir(path)
}

module.exports = {
  fileResolve,
  exitsFolder,
  mapDir,
  deleteDir,
  deleteDir,
  clearDir
}

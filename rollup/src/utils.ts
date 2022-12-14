import Fingerprint2 from 'fingerprintjs2';

export const getFingerprint = (callback?: (id: string) => void) => {
  if (localStorage.getItem('browserId')) {
    callback && callback(localStorage.getItem('browserId')!)
    return
  }
  Fingerprint2.get((components) => { // 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
    const values = components.map(component => component.value) // 配置的值的数组
    const murmur = Fingerprint2.x64hash128(values.join(''), 31) // 生成浏览器指纹
    localStorage.setItem('browserId', murmur)
    callback && callback(murmur)
  });
}
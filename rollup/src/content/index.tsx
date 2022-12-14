import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import SourceFile from './SourceFile'
import { useNotify } from './Notification/index'

const appEl = document.getElementsByTagName('body')[0]
const buttonEl = document.createElement('div')
buttonEl.setAttribute('id', 'sourceMapPage')
appEl?.appendChild(buttonEl)

interface errInfo {
  source: string,
  line: number,
  column: number,
  name: string,
  sourceContent: string
}

// 处理响应的 code
function handleSourceFileContent(content: string, keyLine: number): string {
  let contentList = content.split('\n')

  // 对每行 code 进行处理
  return contentList.map((item: string, index: number) => {
    return `<a style="${index + 1 == keyLine ? 'background-color: red;' : ''}" id="mini-code${index}" class="minicode language-javascript">${item}</a>`
  }).join('\n')

}

export async function reportErrorApi(errorString: string): Promise<{
  data: errInfo
}> {
  return new Promise(async (resolve, reject) => {
    fetch('https://175.178.74.222:3000/getErrorInfo', {
      method: 'post',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        errorString,
        id: localStorage.getItem('minisource_browserId') || null
      })
    }).then((response) => {
      return response.json()
    }).then(({ code, data }) => {
      if (code == 200) {
        resolve({
          data: {
            line: data.line,
            column: data.column,
            name: data.name,
            source: data.source,
            sourceContent: handleSourceFileContent(data.sourceContent, data.line)
          }
        })
      } else {
        reject(data)
      }
    })
  })
}

const App = () => {
  const [showSourceFile, setShowSourceFile] = useState(false)
  const [errorInfo, setErrorInfo] = useState({})

  const { show, RenderNotification } = useNotify()

  const reportError = async (errorString: string) => {
    try {
      let { data } = await reportErrorApi(errorString)
      setErrorInfo(data)
      setShowSourceFile(true)
    } catch (error) {
      show('解析失败')
      console.log('解析失败', error)
    }
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      console.log('onMessage request', request)
      const { type, message } = request
      if (type == 1) {
        localStorage.setItem('minisource_browserId', message)
      } else if (type == 2) {
        const detailContainer = document.querySelectorAll('.detail__container')
        const cloneButton = document.querySelectorAll('.detail__link_clone')
        cloneButton.forEach(item => {
          item.remove();
        })

        if (detailContainer.length > 0) {

          detailContainer.forEach((el, index: number) => {
            var sourceNode = document.querySelector(".detail__link"); // 获得被克隆的节点对象   
            var clonedNode = sourceNode?.cloneNode(true);
            clonedNode.innerText = '解析'
            clonedNode.setAttribute('date-index', String(index))
            clonedNode.setAttribute('class', 'detail__link detail__link_clone')
            el.appendChild(clonedNode)
            clonedNode?.addEventListener('click', (e) => {
              e.stopPropagation()
              reportError(detailContainer[index].innerText)
            })
            // 这里是返回给 background 的内容
            sendResponse('success')
          })
        }
      }
    })
  }, [])

  const close = () => {
    setShowSourceFile(false)
  }

  return (
    <div>
      <RenderNotification>
      </RenderNotification>
      <SourceFile show={showSourceFile} close={() => close()} errorInfo={errorInfo}></SourceFile>
    </div>
  )

}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("sourceMapPage")
);
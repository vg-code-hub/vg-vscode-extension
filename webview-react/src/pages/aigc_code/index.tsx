import { PageContainer } from '@ant-design/pro-components';
// import TransWorker from './transcode.worker.js'
import CryptoJS from 'crypto-js'
import styles from './index.less';
import { Button, Input } from 'antd';
import { useState } from 'react';
import payload from './payload.json'
import { useMount } from 'ahooks';


const { TextArea } = Input;

const APPID = 'a8509f93'
const API_SECRET = 'N2IyMGNmZjU1NDA0MzM1MzBmYTE1NDM1'
const API_KEY = 'fa9123e2df330d86e960e4bd265fab91'


function getWebsocketUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    var apiKey = API_KEY
    var apiSecret = API_SECRET
    var url = 'ws://spark-api.xf-yun.com/v1.1/chat'
    var host = location.host
    var date = new Date().toUTCString()
    var algorithm = 'hmac-sha256'
    var headers = 'host date request-line'
    var signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v1.1/chat HTTP/1.1`
    var signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret)
    var signature = CryptoJS.enc.Base64.stringify(signatureSha)
    var authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`
    var authorization = btoa(authorizationOrigin)
    url = `${url}?authorization=${authorization}&date=${date}&host=${host}`
    resolve(url)
  })
}

const SnippetsPage: React.FC = () => {
  //APPID，APISecret，APIKey在https://console.xfyun.cn/services/cbm这里获取
  const [value, setValue] = useState('讲一下前端发展史');
  const [outputText, setOutputText] = useState('');
  const [btnText, setBtnText] = useState('立即提问');
  var total_res = "";

  useMount(async () => {
    console.log(payload);
    total_res = ""
    for (let obj of payload) {
      await new Promise(resolve => setTimeout(resolve, 100));
      total_res += obj.payload.choices.text.reduce((pre, cur) => pre + cur.content, '')
      setOutputText(total_res)
    }
  })

  var total_res = "";

  class TTSRecorder {
    constructor({
      appId = APPID
    } = {}) {
      this.appId = appId
      this.status = 'init'
    }

    appId: string
    status: "init" | "ttsing" | "error"
    onWillStatusChange: ((oldStatus: string, newStatus: string) => void) | undefined
    ttsWS: WebSocket | undefined
    playTimeout: string | number | undefined;


    // 修改状态
    setStatus(status: "init" | "ttsing" | "error") {
      this.onWillStatusChange && this.onWillStatusChange(this.status, status)
      this.status = status
    }

    // 连接websocket
    connectWebSocket() {
      this.setStatus('ttsing')
      return getWebsocketUrl().then(url => {
        console.log(url);

        let ttsWS
        if ('WebSocket' in window) {
          ttsWS = new WebSocket(url)
        } else if ('MozWebSocket' in window) {
          ttsWS = new MozWebSocket(url)
        } else {
          alert('浏览器不支持WebSocket')
          return
        }
        this.ttsWS = ttsWS
        ttsWS.onopen = () => {
          this.webSocketSend()
        }
        ttsWS.onmessage = (e: { data: any; }) => {
          this.result(e.data)
        }
        ttsWS.onerror = () => {
          clearTimeout(this.playTimeout)
          this.setStatus('error')
          alert('WebSocket报错，请f12查看详情')
          console.error(`详情查看：${encodeURI(url.replace('wss:', 'https:'))}`)
        }
        ttsWS.onclose = (e: any) => {
          console.log(e)
        }
      })
    }


    // websocket发送数据
    webSocketSend() {
      var params = {
        "header": {
          "app_id": this.appId,
          "uid": "fd3f47e4-d"
        },
        "parameter": {
          "chat": {
            "domain": "general",
            "temperature": 0.5,
            "max_tokens": 1024
          }
        },
        "payload": {
          "message": {
            "text": [
              {
                "role": "assistant",
                "content": "我是IT技术专家，请向我提问吧！"
              },
              {
                "role": "user",
                "content": value
              }
            ]
          }
        }
      }
      console.log(JSON.stringify(params))
      this.ttsWS!.send(JSON.stringify(params))
    }

    start() {
      total_res = ""; // 请空回答历史
      this.connectWebSocket()
    }

    // websocket接收数据的处理
    result(resultData: string) {
      let jsonData = JSON.parse(resultData)
      total_res = total_res + jsonData.payload.choices.text.reduce((pre: any, cur: any) => pre + cur.content, '')
      setOutputText(total_res)

      // 提问失败
      if (jsonData.header.code !== 0) {
        alert(`提问失败: ${jsonData.header.code}:${jsonData.header.message}`)
        console.error(`${jsonData.header.code}:${jsonData.header.message}`)
        return
      }
      if (jsonData.header.code === 0 && jsonData.header.status === 2) {
        this.ttsWS!.close()
        bigModel.setStatus("init")
      }
    }
  }


  // ======================开始调用=============================
  let bigModel = new TTSRecorder()
  bigModel.onWillStatusChange = function (oldStatus, status) {
    // 可以在这里进行页面中一些交互逻辑处理：按钮交互等
    // 按钮中的文字
    let btnState = {
      init: '立即提问',
      ttsing: '回答中...'
    }
    setBtnText(btnState[status as keyof typeof btnState] as string)
  }

  function audioCtrlBtnClick() {
    if (['init', 'endPlay', 'errorTTS'].indexOf(bigModel.status) > -1) {
      bigModel.start()
    }
  }


  return (
    <PageContainer ghost>
      <TextArea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入您要问大模型的问题"
        autoSize={{ minRows: 3, maxRows: 5 }}
      />
      <div className={styles['audio-ctrl-btn']}>
        <Button onClick={audioCtrlBtnClick}>{btnText}</Button>
      </div>
      <TextArea
        value={outputText}
        autoSize={{ minRows: 3, maxRows: 20 }}
      />
    </PageContainer>
  );
};

export default SnippetsPage;
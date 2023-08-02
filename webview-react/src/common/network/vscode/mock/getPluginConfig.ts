export default {
  "type": "dart",
  "swagger": {
    "jsonUrl": "http://127.0.0.1:4523/export/openapi?projectId=2540665&version=3.0",
    "outputDir": "api",
    "folderFilter": [
      "app接口"
    ],
    "folderMap": {
      "app接口": "app",
      "app接口模型": "app",
      "app模型": "app",
      "驾驶员:driver": "driver",
      "项目:project": "project"
    },
    "customPathFolder": {
      "/v1/app/login": "test/login",
      "/v1/common/upload": "test/upload",
      "/v1/driver.*/": "test/driver"
    },
    "customModelFolder": {
      "DeviceListResp": "test",
      "DeviceHistoryNewResp": "test/history"
    }
  },
  "mock": {
    "mockNumber": "Random.natural(1000,1000)",
    "mockBoolean": "false",
    "mockString": "Random.cword(5, 7)",
    "mockKeyWordEqual": [],
    "mockKeyWordLike": []
  }
};

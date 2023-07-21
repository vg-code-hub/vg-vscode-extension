/*
 * @Author: zdd
 * @Date: 2023-07-20 11:41:52
 * @LastEditors: zdd
 * @LastEditTime: 2023-07-20 11:53:16
 * @FilePath: /vg-vscode-extension/webview-react/src/common/network/vscode/mock/getLocalSchemas.ts
 * @Description: 
 */
export default {
  "/entitys/app/project": [
    {
      "key": "DeviceRequirementCreate",
      "value": {
        "type": "object",
        "properties": {
          "deviceId": {
            "type": "integer",
            "title": "设备id"
          },
          "deviceName": {
            "type": "string",
            "title": "设备名"
          },
          "devicePic": {
            "type": "string",
            "title": "设备图片"
          },
          "driverRequirement": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "driverId": {
                  "type": "integer",
                  "title": "驾驶员id"
                },
                "driverName": {
                  "type": "string",
                  "title": "驾驶员名"
                }
              },
              "required": [
                "driverId",
                "driverName"
              ],
              "x-apifox-orders": [
                "driverId",
                "driverName"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "驾驶员需求"
          }
        },
        "x-apifox-orders": [
          "deviceId",
          "deviceName",
          "devicePic",
          "driverRequirement"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/project"
      }
    },
    {
      "key": "ProjectLog",
      "value": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "username": {
            "type": "string",
            "title": "用户名"
          },
          "user_id": {
            "type": "integer"
          },
          "request_method": {
            "type": "string"
          },
          "msg": {
            "type": "string",
            "title": "内容"
          },
          "oper_time": {
            "type": "string",
            "title": "操作时间"
          }
        },
        "x-apifox-orders": [
          "id",
          "username",
          "user_id",
          "request_method",
          "msg",
          "oper_time"
        ],
        "required": [
          "id",
          "username",
          "msg",
          "oper_time",
          "request_method",
          "user_id"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/project"
      }
    },
    {
      "key": "SimpleProject",
      "value": {
        "type": "object",
        "properties": {
          "project_id": {
            "type": "integer"
          },
          "project_name": {
            "type": "string"
          }
        },
        "required": [
          "project_id",
          "project_name"
        ],
        "x-apifox-orders": [
          "project_id",
          "project_name"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/project"
      }
    },
    {
      "key": "ProjectRefuelRecordResp",
      "value": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "refuel_record_list": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "is_machine_acquisition": {
                  "type": "boolean",
                  "title": "是否是机器采集"
                },
                "project_id": {
                  "type": "integer",
                  "title": "项目id"
                },
                "project_name": {
                  "type": "string",
                  "title": "项目名"
                },
                "applicant_id": {
                  "type": "integer",
                  "title": "申请人id"
                },
                "applicant_name": {
                  "type": "string",
                  "title": "申请人名字"
                },
                "refuel_count": {
                  "type": "string",
                  "title": "加油量"
                },
                "expense": {
                  "type": "string",
                  "title": "费用"
                },
                "attachment": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  },
                  "title": "图片",
                  "nullable": true
                },
                "refuel_time": {
                  "type": "string",
                  "title": "加油时间"
                }
              },
              "x-apifox-orders": [
                "is_machine_acquisition",
                "project_id",
                "project_name",
                "applicant_id",
                "applicant_name",
                "refuel_count",
                "expense",
                "attachment",
                "refuel_time"
              ],
              "x-apifox-ignore-properties": []
            }
          }
        },
        "required": [
          "title",
          "refuel_record_list"
        ],
        "x-apifox-orders": [
          "title",
          "refuel_record_list"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/project"
      }
    },
    {
      "key": "UpdateProjectReq",
      "value": {
        "type": "object",
        "properties": {
          "projectId": {
            "type": "integer",
            "title": "项目id"
          },
          "projectName": {
            "type": "string",
            "title": "项目名"
          },
          "timeFrom": {
            "type": "string",
            "title": "项目开始时间"
          },
          "timeTo": {
            "type": "string",
            "title": "项目结束时间"
          },
          "location": {
            "type": "string",
            "title": "位置"
          },
          "lat": {
            "type": "string",
            "title": "纬度"
          },
          "lng": {
            "type": "string",
            "title": "经度"
          },
          "status": {
            "type": "string",
            "title": "项目状态"
          },
          "workShift": {
            "type": "number",
            "title": "台班"
          },
          "deviceRequirement": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "deviceRequirementId": {
                  "type": "integer",
                  "title": "设备需求id"
                },
                "deviceId": {
                  "type": "integer",
                  "title": "设备id"
                },
                "deviceName": {
                  "type": "string",
                  "title": "设备名"
                },
                "devicePic": {
                  "type": "string",
                  "title": "设备图片"
                },
                "driverRequirement": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "driverId": {
                        "type": "integer",
                        "title": "驾驶员id"
                      },
                      "driverName": {
                        "type": "string",
                        "title": "驾驶员名"
                      }
                    },
                    "required": [
                      "driverId",
                      "driverName"
                    ],
                    "x-apifox-orders": [
                      "driverId",
                      "driverName"
                    ],
                    "x-apifox-ignore-properties": []
                  },
                  "title": "驾驶员需求"
                }
              },
              "required": [
                "deviceRequirementId",
                "deviceId",
                "deviceName",
                "devicePic",
                "driverRequirement"
              ],
              "x-apifox-orders": [
                "deviceRequirementId",
                "deviceId",
                "deviceName",
                "devicePic",
                "driverRequirement"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "设备需求"
          }
        },
        "required": [
          "projectId",
          "projectName",
          "timeFrom",
          "timeTo",
          "location",
          "lat",
          "lng",
          "status",
          "workShift",
          "deviceRequirement"
        ],
        "x-apifox-orders": [
          "projectId",
          "projectName",
          "timeFrom",
          "timeTo",
          "location",
          "lat",
          "lng",
          "status",
          "workShift",
          "deviceRequirement"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/project"
      }
    },
    {
      "key": "CreateProjectReq",
      "value": {
        "type": "object",
        "properties": {
          "projectName": {
            "type": "string",
            "title": "项目名"
          },
          "timeFrom": {
            "type": "string",
            "title": "项目开始时间"
          },
          "timeTo": {
            "type": "string",
            "title": "项目结束时间"
          },
          "location": {
            "type": "string",
            "title": "位置"
          },
          "lat": {
            "type": "string",
            "title": "纬度"
          },
          "lng": {
            "type": "string",
            "title": "经度"
          },
          "description": {
            "type": "string",
            "title": "项目描述"
          },
          "workShift": {
            "type": "number",
            "title": "台班"
          },
          "deviceRequirement": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/DeviceRequirementCreate"
            },
            "title": "设备需求"
          }
        },
        "required": [
          "projectName",
          "timeFrom",
          "timeTo",
          "location",
          "lat",
          "lng",
          "description",
          "workShift",
          "deviceRequirement"
        ],
        "x-apifox-orders": [
          "projectName",
          "timeFrom",
          "timeTo",
          "location",
          "lat",
          "lng",
          "description",
          "workShift",
          "deviceRequirement"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/project"
      }
    },
    {
      "key": "deviceHistoryResp",
      "value": {
        "type": "object",
        "properties": {
          "working_status": {
            "type": "string",
            "title": "工作状态"
          },
          "lat": {
            "type": "string",
            "title": "纬度"
          },
          "lng": {
            "type": "string",
            "title": "经度"
          },
          "oil_consumption": {
            "type": "string",
            "title": "油耗"
          },
          "speed": {
            "type": "string",
            "title": "速度"
          },
          "engine_hours": {
            "type": "string",
            "title": "工作时长"
          },
          "time": {
            "type": "string",
            "title": "时间"
          }
        },
        "required": [
          "working_status",
          "lat",
          "lng",
          "oil_consumption",
          "speed",
          "engine_hours",
          "time"
        ],
        "x-apifox-orders": [
          "working_status",
          "lat",
          "lng",
          "oil_consumption",
          "speed",
          "engine_hours",
          "time"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/project"
      }
    },
    {
      "key": "projectDetailResp",
      "value": {
        "type": "object",
        "properties": {
          "project_id": {
            "type": "integer",
            "title": "项目id"
          },
          "project_name": {
            "type": "string",
            "title": "项目名"
          },
          "time_from": {
            "type": "string",
            "title": "项目开始时间"
          },
          "time_to": {
            "type": "string",
            "title": "项目结束时间"
          },
          "location": {
            "type": "string",
            "title": "位置"
          },
          "lat": {
            "type": "string",
            "title": "纬度"
          },
          "lng": {
            "type": "string",
            "title": "经度"
          },
          "status": {
            "type": "string",
            "title": "项目状态"
          },
          "workShift": {
            "type": "number",
            "title": "台班"
          },
          "device_requirement": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "deviceRequirementId": {
                  "type": "integer",
                  "title": "设备需求id"
                },
                "deviceId": {
                  "type": "integer",
                  "title": "设备id"
                },
                "deviceName": {
                  "type": "string",
                  "title": "设备名"
                },
                "devicePic": {
                  "type": "string",
                  "title": "设备图片"
                },
                "driverRequirement": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "driverId": {
                        "type": "integer",
                        "title": "驾驶员id"
                      },
                      "driverName": {
                        "type": "string",
                        "title": "驾驶员名"
                      }
                    },
                    "required": [
                      "driverId",
                      "driverName"
                    ],
                    "x-apifox-orders": [
                      "driverId",
                      "driverName"
                    ],
                    "x-apifox-ignore-properties": []
                  },
                  "title": "驾驶员需求"
                }
              },
              "required": [
                "deviceRequirementId",
                "deviceId",
                "deviceName",
                "devicePic",
                "driverRequirement"
              ],
              "x-apifox-orders": [
                "deviceRequirementId",
                "deviceId",
                "deviceName",
                "devicePic",
                "driverRequirement"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "设备需求"
          }
        },
        "required": [
          "project_id",
          "project_name",
          "time_from",
          "time_to",
          "location",
          "lat",
          "lng",
          "status",
          "device_requirement",
          "workShift"
        ],
        "x-apifox-orders": [
          "project_id",
          "project_name",
          "time_from",
          "time_to",
          "location",
          "lat",
          "lng",
          "status",
          "workShift",
          "device_requirement"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/project"
      }
    },
    {
      "key": "projectListResp",
      "value": {
        "type": "object",
        "properties": {
          "projectId": {
            "type": "integer",
            "title": "项目id"
          },
          "projectName": {
            "type": "string",
            "title": "项目名"
          },
          "timeFrom": {
            "type": "string",
            "title": "项目开始时间"
          },
          "timeTo": {
            "type": "string",
            "title": "项目结束时间"
          },
          "location": {
            "type": "string",
            "title": "地理位置"
          },
          "lat": {
            "type": "string",
            "title": "纬度"
          },
          "lng": {
            "type": "string",
            "title": "经度"
          },
          "status": {
            "type": "string",
            "title": "项目状态"
          },
          "workShift": {
            "type": "number",
            "title": "台班"
          },
          "description": {
            "type": "string",
            "title": "项目描述信息"
          },
          "deviceRequirement": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "deviceRequirementId": {
                  "type": "integer",
                  "title": "设备需求id"
                },
                "deviceId": {
                  "type": "integer",
                  "title": "设备id"
                },
                "deviceName": {
                  "type": "string",
                  "title": "设备名"
                },
                "devicePic": {
                  "type": "string",
                  "title": "设备图片"
                },
                "driverRequirement": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "driverId": {
                        "type": "integer",
                        "title": "驾驶员id"
                      },
                      "driverName": {
                        "type": "string",
                        "title": "驾驶员名"
                      }
                    },
                    "required": [
                      "driverId",
                      "driverName"
                    ],
                    "x-apifox-orders": [
                      "driverId",
                      "driverName"
                    ],
                    "x-apifox-ignore-properties": []
                  },
                  "title": "驾驶员需求"
                }
              },
              "required": [
                "deviceRequirementId",
                "deviceId",
                "deviceName",
                "devicePic",
                "driverRequirement"
              ],
              "x-apifox-orders": [
                "deviceRequirementId",
                "deviceId",
                "deviceName",
                "devicePic",
                "driverRequirement"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "设备需求"
          }
        },
        "required": [
          "projectId",
          "projectName",
          "timeFrom",
          "timeTo",
          "location",
          "lat",
          "lng",
          "status",
          "deviceRequirement",
          "workShift",
          "description"
        ],
        "x-apifox-orders": [
          "projectId",
          "projectName",
          "timeFrom",
          "timeTo",
          "location",
          "lat",
          "lng",
          "status",
          "workShift",
          "description",
          "deviceRequirement"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/project"
      }
    }
  ],
  "/entitys/test": [
    {
      "key": "DeviceListResp",
      "value": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "title": "设备id"
          },
          "device_name": {
            "type": "string",
            "title": "设备名"
          },
          "area_name": {
            "type": "string",
            "title": "区域名"
          },
          "device_type": {
            "type": "string",
            "title": "设备类型"
          },
          "model_no": {
            "type": "string",
            "title": "设备型号"
          },
          "model_code": {
            "type": "string",
            "title": "型号编码"
          },
          "coordinate": {
            "type": "object",
            "properties": {
              "Lat": {
                "type": "string",
                "title": "纬度"
              },
              "Lng": {
                "type": "string",
                "title": "经度"
              },
              "Location": {
                "type": "string",
                "title": "位置"
              }
            },
            "required": [
              "Lat",
              "Lng",
              "Location"
            ],
            "x-apifox-orders": [
              "Lat",
              "Lng",
              "Location"
            ],
            "title": "坐标",
            "x-apifox-ignore-properties": []
          },
          "pic": {
            "type": "string",
            "title": "图片"
          },
          "iccid": {
            "type": "string"
          },
          "imei": {
            "type": "string"
          },
          "is_online": {
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "device_name",
          "area_name",
          "device_type",
          "model_no",
          "coordinate",
          "pic",
          "iccid",
          "imei",
          "model_code",
          "is_online"
        ],
        "x-apifox-orders": [
          "id",
          "device_name",
          "area_name",
          "device_type",
          "model_no",
          "model_code",
          "coordinate",
          "pic",
          "iccid",
          "imei",
          "is_online"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "大屏"
      }
    },
    {
      "key": "deviceListResp",
      "value": {
        "type": "object",
        "properties": {
          "deviceId": {
            "type": "integer",
            "title": "设备id"
          },
          "companyId": {
            "type": "integer",
            "title": "公司id"
          },
          "areaName": {
            "type": "string",
            "title": "区域名"
          },
          "deviceName": {
            "type": "string",
            "title": "设备名"
          },
          "deviceType": {
            "type": "string",
            "title": "设备类型"
          },
          "projectName": {
            "type": "string",
            "title": "项目名"
          },
          "modelNo": {
            "type": "string",
            "title": "型号"
          },
          "coordinate": {
            "type": "object",
            "properties": {
              "lat": {
                "type": "string",
                "title": "纬度"
              },
              "lng": {
                "type": "string",
                "title": "经度"
              },
              "location": {
                "type": "string",
                "title": "地址位置"
              }
            },
            "required": [
              "lat",
              "lng",
              "location"
            ],
            "x-apifox-orders": [
              "lat",
              "lng",
              "location"
            ],
            "title": "坐标",
            "x-apifox-ignore-properties": []
          },
          "pic": {
            "type": "string",
            "title": "图片"
          },
          "needRepair": {
            "type": "boolean",
            "title": "是否需要修理"
          },
          "needMaintain": {
            "type": "boolean",
            "title": "是否需要保养"
          },
          "hardware": {
            "type": "object",
            "properties": {
              "TTXMonitor": {
                "type": "boolean",
                "title": "是否有监控摄像头"
              },
              "XGGps": {
                "type": "boolean",
                "title": "暂无"
              },
              "XTF": {
                "type": "boolean",
                "title": "暂无"
              },
              "XTM": {
                "type": "boolean",
                "title": "暂无"
              },
              "XTT": {
                "type": "boolean",
                "title": "暂无"
              }
            },
            "required": [
              "TTXMonitor",
              "XGGps",
              "XTF",
              "XTM",
              "XTT"
            ],
            "x-apifox-orders": [
              "TTXMonitor",
              "XGGps",
              "XTF",
              "XTM",
              "XTT"
            ],
            "title": "硬件状态",
            "x-apifox-ignore-properties": []
          },
          "status": {
            "type": "object",
            "properties": {
              "fuelStatus": {
                "type": "object",
                "properties": {
                  "oilConsumption": {
                    "type": "string",
                    "title": "油耗"
                  },
                  "dataTime": {
                    "type": "string",
                    "title": "时间"
                  }
                },
                "required": [
                  "oilConsumption",
                  "dataTime"
                ],
                "x-apifox-orders": [
                  "oilConsumption",
                  "dataTime"
                ],
                "x-apifox-ignore-properties": []
              },
              "workingStatus": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string",
                    "title": "工作状态"
                  },
                  "dataTime": {
                    "type": "string",
                    "title": "时间"
                  },
                  "speed": {
                    "type": "string"
                  }
                },
                "required": [
                  "status",
                  "speed",
                  "dataTime"
                ],
                "x-apifox-orders": [
                  "status",
                  "dataTime",
                  "speed"
                ],
                "x-apifox-ignore-properties": []
              },
              "monitorStatus": {
                "type": "object",
                "properties": {
                  "isOnline": {
                    "type": "boolean",
                    "title": "监控摄像头是否在线"
                  },
                  "dataTime": {
                    "type": "string",
                    "title": "时间"
                  }
                },
                "required": [
                  "isOnline",
                  "dataTime"
                ],
                "x-apifox-orders": [
                  "isOnline",
                  "dataTime"
                ],
                "x-apifox-ignore-properties": []
              },
              "runningTime": {
                "type": "object",
                "properties": {
                  "runningSecs": {
                    "type": "number"
                  },
                  "dataTime": {
                    "type": "string",
                    "title": "时间"
                  }
                },
                "required": [
                  "runningSecs",
                  "dataTime"
                ],
                "x-apifox-orders": [
                  "runningSecs",
                  "dataTime"
                ],
                "x-apifox-ignore-properties": []
              }
            },
            "required": [
              "fuelStatus",
              "workingStatus",
              "monitorStatus",
              "runningTime"
            ],
            "x-apifox-orders": [
              "fuelStatus",
              "workingStatus",
              "monitorStatus",
              "runningTime"
            ],
            "title": "设备各个状态信息",
            "x-apifox-ignore-properties": []
          },
          "failure": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "title": "故障类型"
              },
              "message": {
                "type": "string",
                "title": "故障信息"
              },
              "dataTime": {
                "type": "string",
                "title": "时间"
              }
            },
            "title": "故障列表",
            "x-apifox-orders": [
              "type",
              "message",
              "dataTime"
            ],
            "required": [
              "type",
              "message",
              "dataTime"
            ],
            "x-apifox-ignore-properties": [],
            "nullable": true
          },
          "iccid": {
            "type": "string",
            "title": "设备iccid"
          },
          "imei": {
            "type": "string",
            "title": "设备imei"
          },
          "manual": {
            "type": "string",
            "title": "设备手册"
          },
          "totalWorkingHours": {
            "type": "string",
            "title": "总工作时长"
          },
          "lastMaintenAt": {
            "type": "string",
            "title": "上一次保养时间"
          }
        },
        "required": [
          "deviceId",
          "companyId",
          "areaName",
          "deviceName",
          "projectName",
          "modelNo",
          "coordinate",
          "pic",
          "needRepair",
          "needMaintain",
          "hardware",
          "status",
          "failure",
          "iccid",
          "imei",
          "deviceType",
          "manual",
          "totalWorkingHours",
          "lastMaintenAt"
        ],
        "x-apifox-orders": [
          "deviceId",
          "companyId",
          "areaName",
          "deviceName",
          "deviceType",
          "projectName",
          "modelNo",
          "coordinate",
          "pic",
          "needRepair",
          "needMaintain",
          "hardware",
          "status",
          "failure",
          "iccid",
          "imei",
          "manual",
          "totalWorkingHours",
          "lastMaintenAt"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    }
  ],
  "/entitys/test/history": [
    {
      "key": "DeviceHistoryNewResp",
      "value": {
        "type": "object",
        "properties": {
          "location_history": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "lat": {
                  "type": "string",
                  "title": "纬度"
                },
                "lng": {
                  "type": "string",
                  "title": "经度"
                },
                "dataTime": {
                  "type": "string",
                  "title": "时间"
                }
              },
              "required": [
                "lat",
                "lng",
                "dataTime"
              ],
              "x-apifox-orders": [
                "lat",
                "lng",
                "dataTime"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "经纬度历史记录",
            "nullable": true
          },
          "oil_consumption_history": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "value": {
                  "type": "string",
                  "title": "油耗"
                },
                "dataTime": {
                  "type": "string",
                  "title": "时间"
                }
              },
              "required": [
                "value",
                "dataTime"
              ],
              "x-apifox-orders": [
                "value",
                "dataTime"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "油耗历史记录",
            "nullable": true
          },
          "engine_hours_history": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "value": {
                  "type": "string",
                  "title": "工作时间"
                },
                "dataTime": {
                  "type": "string",
                  "title": "时间"
                }
              },
              "x-apifox-orders": [
                "value",
                "dataTime"
              ],
              "required": [
                "value",
                "dataTime"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "工作时间历史记录",
            "nullable": true
          },
          "oil_current_history": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "value": {
                  "type": "string",
                  "title": "油量"
                },
                "dataTime": {
                  "type": "string",
                  "title": "时间"
                }
              },
              "x-apifox-orders": [
                "value",
                "dataTime"
              ],
              "required": [
                "value",
                "dataTime"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "油量历史记录",
            "nullable": true
          }
        },
        "required": [
          "location_history",
          "oil_consumption_history",
          "engine_hours_history",
          "oil_current_history"
        ],
        "x-apifox-orders": [
          "location_history",
          "oil_consumption_history",
          "engine_hours_history",
          "oil_current_history"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    }
  ],
  "/entitys/app/repair_report": [
    {
      "key": "AssignerListResp",
      "value": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer",
            "title": "id"
          },
          "real_name": {
            "type": "string",
            "title": "名字"
          }
        },
        "required": [
          "id",
          "real_name"
        ],
        "x-apifox-orders": [
          "id",
          "real_name"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/报修"
      }
    },
    {
      "key": "AssignRepairReportReq",
      "value": {
        "type": "object",
        "properties": {
          "repair_report_id": {
            "type": "integer",
            "title": "报修id"
          },
          "repair_id": {
            "type": "integer",
            "title": "维修人id"
          },
          "repair_name": {
            "type": "string",
            "title": "维修人名字"
          },
          "remark": {
            "type": "string",
            "title": "备注"
          }
        },
        "required": [
          "repair_report_id",
          "repair_id",
          "remark",
          "repair_name"
        ],
        "x-apifox-orders": [
          "repair_report_id",
          "repair_id",
          "repair_name",
          "remark"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/报修"
      }
    },
    {
      "key": "RepairReportListResp",
      "value": {
        "type": "object",
        "properties": {
          "repair_report_id": {
            "type": "integer",
            "title": "报修id"
          },
          "applicant_id": {
            "type": "integer",
            "title": "报修人id"
          },
          "applicant_name": {
            "type": "string",
            "title": "报修人名字"
          },
          "fault_level": {
            "type": "string",
            "title": "故障等级"
          },
          "content": {
            "type": "string",
            "title": "报修内容"
          },
          "attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "图片(多个图片以,分开)"
          },
          "status": {
            "type": "string",
            "title": "报修状态"
          },
          "repair_report_time": {
            "type": "string",
            "title": "报修时间"
          }
        },
        "required": [
          "repair_report_id",
          "applicant_id",
          "applicant_name",
          "fault_level",
          "content",
          "attachment",
          "status",
          "repair_report_time"
        ],
        "x-apifox-orders": [
          "repair_report_id",
          "applicant_id",
          "applicant_name",
          "fault_level",
          "content",
          "attachment",
          "status",
          "repair_report_time"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/报修"
      }
    },
    {
      "key": "CreateRepairReportReq",
      "value": {
        "type": "object",
        "properties": {
          "device_id": {
            "type": "integer",
            "title": "设备id"
          },
          "fault_level": {
            "type": "string",
            "title": "故障等级"
          },
          "content": {
            "type": "string",
            "title": "报修内容"
          },
          "attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "图片数组"
          }
        },
        "required": [
          "device_id",
          "fault_level",
          "content",
          "attachment"
        ],
        "x-apifox-orders": [
          "device_id",
          "fault_level",
          "content",
          "attachment"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/报修"
      }
    }
  ],
  "/entitys/app/login": [
    {
      "key": "LoginResp",
      "value": {
        "type": "object",
        "properties": {
          "token": {
            "type": "string"
          }
        },
        "required": [
          "token"
        ],
        "x-apifox-orders": [
          "token"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/登录"
      }
    },
    {
      "key": "LoginReq",
      "value": {
        "type": "object",
        "properties": {
          "mobile": {
            "type": "string",
            "title": "手机号"
          },
          "pass": {
            "type": "string",
            "title": "密码"
          }
        },
        "required": [
          "mobile",
          "pass"
        ],
        "x-apifox-orders": [
          "mobile",
          "pass"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/登录"
      }
    }
  ],
  "/entitys/app/transportation_records": [
    {
      "key": "ListTransportRecordResp",
      "value": {
        "type": "object",
        "properties": {
          "project_id": {
            "type": "integer",
            "title": "项目id"
          },
          "project_name": {
            "type": "string",
            "title": "项目名"
          },
          "applicant_id": {
            "type": "integer",
            "title": "运输申请人id"
          },
          "applicant_name": {
            "type": "string",
            "title": "运输申请人名字"
          },
          "mileage": {
            "type": "string",
            "title": "里程数"
          },
          "expense": {
            "type": "string",
            "title": "运输费用"
          },
          "attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "运输单据"
          },
          "transport_time": {
            "type": "string",
            "title": "运输时间（创建记录时间）"
          },
          "origin_location": {
            "type": "string",
            "title": "源位置"
          },
          "target_location": {
            "type": "string",
            "title": "目标位置"
          },
          "origin_project_id": {
            "type": "integer",
            "title": "调出项目id"
          },
          "origin_project_name": {
            "type": "string",
            "title": "调出项目名"
          },
          "call_out_time": {
            "type": "string",
            "title": "调出时间"
          },
          "call_in_time": {
            "type": "string",
            "title": "调入时间"
          },
          "remark": {
            "type": "string",
            "title": "备注"
          }
        },
        "required": [
          "project_id",
          "project_name",
          "applicant_id",
          "applicant_name",
          "mileage",
          "attachment",
          "transport_time",
          "expense",
          "origin_location",
          "target_location",
          "origin_project_id",
          "origin_project_name",
          "call_out_time",
          "call_in_time",
          "remark"
        ],
        "x-apifox-orders": [
          "project_id",
          "project_name",
          "applicant_id",
          "applicant_name",
          "mileage",
          "expense",
          "attachment",
          "transport_time",
          "origin_location",
          "target_location",
          "origin_project_id",
          "origin_project_name",
          "call_out_time",
          "call_in_time",
          "remark"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/运输记录"
      }
    },
    {
      "key": "CreateTransportRecordReq",
      "value": {
        "type": "object",
        "properties": {
          "device_id": {
            "type": "integer",
            "title": "设备id"
          },
          "project_id": {
            "type": "integer",
            "title": "项目id"
          },
          "mileage": {
            "type": "string",
            "title": "里程数"
          },
          "expense": {
            "type": "string",
            "title": "运输费用"
          },
          "attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "运输单据"
          },
          "origin_location": {
            "type": "string",
            "title": "源位置"
          },
          "target_location": {
            "type": "string",
            "title": "目标位置"
          },
          "origin_project_id": {
            "type": "integer",
            "title": "调出项目id"
          },
          "call_out_time": {
            "type": "string",
            "title": "调出时间"
          },
          "call_in_time": {
            "type": "string",
            "title": "调入时间"
          },
          "remark": {
            "type": "string",
            "title": "备注"
          }
        },
        "required": [
          "device_id",
          "project_id",
          "mileage",
          "attachment",
          "expense",
          "origin_location",
          "target_location",
          "origin_project_id",
          "call_out_time",
          "call_in_time",
          "remark"
        ],
        "x-apifox-orders": [
          "device_id",
          "project_id",
          "mileage",
          "expense",
          "attachment",
          "origin_location",
          "target_location",
          "origin_project_id",
          "call_out_time",
          "call_in_time",
          "remark"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/运输记录"
      }
    }
  ],
  "/entitys/app/refueling_record": [
    {
      "key": "ListRefuelRecordResp",
      "value": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string"
          },
          "refuel_record_list": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "is_machine_acquisition": {
                  "type": "boolean",
                  "title": "是否是机器采集"
                },
                "project_id": {
                  "type": "integer",
                  "title": "项目id"
                },
                "project_name": {
                  "type": "string",
                  "title": "项目名"
                },
                "applicant_id": {
                  "type": "integer",
                  "title": "申请人id"
                },
                "applicant_name": {
                  "type": "string",
                  "title": "申请人名字"
                },
                "refuel_count": {
                  "type": "string",
                  "title": "加油数量"
                },
                "expense": {
                  "type": "string",
                  "title": "费用"
                },
                "attachment": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "nullable": true
                  },
                  "title": "加油单据",
                  "nullable": true
                },
                "unit_price": {
                  "type": "string",
                  "title": "单价"
                },
                "remark": {
                  "type": "string",
                  "title": "备注"
                },
                "refuel_time": {
                  "type": "string",
                  "title": "加油时间"
                }
              },
              "required": [
                "is_machine_acquisition",
                "project_id",
                "project_name",
                "applicant_id",
                "applicant_name",
                "refuel_count",
                "expense",
                "attachment",
                "refuel_time",
                "remark",
                "unit_price"
              ],
              "x-apifox-orders": [
                "is_machine_acquisition",
                "project_id",
                "project_name",
                "applicant_id",
                "applicant_name",
                "refuel_count",
                "expense",
                "attachment",
                "unit_price",
                "remark",
                "refuel_time"
              ],
              "x-apifox-ignore-properties": []
            }
          }
        },
        "required": [
          "title",
          "refuel_record_list"
        ],
        "x-apifox-orders": [
          "title",
          "refuel_record_list"
        ],
        "x-apifox-ignore-properties": [],
        "nullable": true,
        "x-apifox-folder": "app接口模型/加油记录"
      }
    },
    {
      "key": "CreateRefuelRecordReq",
      "value": {
        "type": "object",
        "properties": {
          "device_id": {
            "type": "integer",
            "title": "设备id"
          },
          "project_id": {
            "type": "integer",
            "title": "项目id"
          },
          "refuel_count": {
            "type": "string",
            "title": "加油数量"
          },
          "expense": {
            "type": "string",
            "title": "加油费用"
          },
          "attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "加油单据"
          },
          "unit_price": {
            "type": "string",
            "title": "加油单价"
          },
          "remark": {
            "type": "string",
            "title": "备注"
          }
        },
        "required": [
          "device_id",
          "project_id",
          "refuel_count",
          "attachment",
          "expense",
          "unit_price",
          "remark"
        ],
        "x-apifox-orders": [
          "device_id",
          "project_id",
          "refuel_count",
          "expense",
          "attachment",
          "unit_price",
          "remark"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/加油记录"
      }
    }
  ],
  "/entitys/app/service": [
    {
      "key": "RepairListResp",
      "value": {
        "type": "object",
        "properties": {
          "repair_report_id": {
            "type": "integer",
            "title": "报修id"
          },
          "applicant_id": {
            "type": "integer",
            "title": "报修人id"
          },
          "applicant_name": {
            "type": "string",
            "title": "报修人名字"
          },
          "fault_level": {
            "type": "string",
            "title": "故障等级"
          },
          "content": {
            "type": "string",
            "title": "故障内容"
          },
          "attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "图片"
          },
          "repair_report_time": {
            "type": "string",
            "title": "报修时间"
          },
          "repair_id": {
            "type": "integer",
            "title": "修理人id"
          },
          "repair_name": {
            "type": "string",
            "title": "修理人名字"
          },
          "remark": {
            "type": "string",
            "title": "修理备注"
          },
          "fault_description": {
            "type": "string",
            "title": "故障描述"
          },
          "fault_attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "故障图片"
          },
          "repair_remark": {
            "type": "string",
            "title": "维修备注"
          },
          "repair_expenses": {
            "type": "string",
            "title": "维修费用"
          },
          "repair_time": {
            "type": "string",
            "title": "维修时间"
          },
          "repair_parts": {
            "type": "string",
            "title": "维修配件"
          },
          "repair_hours": {
            "type": "integer",
            "title": "维修工时"
          },
          "repair_method": {
            "type": "string",
            "title": "维修方式"
          },
          "repair_content": {
            "type": "string",
            "title": "维修内容"
          },
          "status": {
            "type": "string",
            "title": "状态"
          }
        },
        "required": [
          "repair_report_id",
          "applicant_id",
          "applicant_name",
          "fault_level",
          "content",
          "attachment",
          "repair_report_time",
          "repair_id",
          "repair_name",
          "remark",
          "fault_description",
          "fault_attachment",
          "repair_remark",
          "repair_expenses",
          "repair_time",
          "status",
          "repair_parts",
          "repair_hours",
          "repair_method",
          "repair_content"
        ],
        "x-apifox-orders": [
          "repair_report_id",
          "applicant_id",
          "applicant_name",
          "fault_level",
          "content",
          "attachment",
          "repair_report_time",
          "repair_id",
          "repair_name",
          "remark",
          "fault_description",
          "fault_attachment",
          "repair_remark",
          "repair_expenses",
          "repair_time",
          "repair_parts",
          "repair_hours",
          "repair_method",
          "repair_content",
          "status"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/维修"
      }
    },
    {
      "key": "RegisterReq",
      "value": {
        "type": "object",
        "properties": {
          "repair_report_id": {
            "type": "integer",
            "title": "报修id"
          },
          "repair_expenses": {
            "type": "string",
            "title": "维修费用"
          },
          "fault_description": {
            "type": "string",
            "title": "故障描述"
          },
          "fault_attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "故障图片"
          },
          "repair_remark": {
            "type": "string",
            "title": "备注"
          },
          "repair_time": {
            "type": "string",
            "title": "维修时间"
          },
          "repair_parts": {
            "type": "string",
            "title": "维修配件"
          },
          "repair_hours": {
            "type": "integer",
            "title": "维修工时"
          },
          "repair_method": {
            "type": "string",
            "title": "维修方式"
          },
          "repair_content": {
            "type": "string",
            "title": "维修内容"
          }
        },
        "x-apifox-orders": [
          "repair_report_id",
          "repair_expenses",
          "fault_description",
          "fault_attachment",
          "repair_remark",
          "repair_time",
          "repair_parts",
          "repair_hours",
          "repair_method",
          "repair_content"
        ],
        "required": [
          "repair_report_id",
          "fault_description",
          "repair_remark",
          "fault_attachment",
          "repair_expenses",
          "repair_time",
          "repair_parts",
          "repair_hours",
          "repair_method",
          "repair_content"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/维修"
      }
    }
  ],
  "/entitys/app/device": [
    {
      "key": "EngineHoursHistory",
      "value": {
        "type": "object",
        "properties": {
          "value": {
            "type": "string",
            "title": "工作时间"
          },
          "dataTime": {
            "type": "string",
            "title": "数据时间"
          }
        },
        "required": [
          "value",
          "dataTime"
        ],
        "x-apifox-orders": [
          "value",
          "dataTime"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    },
    {
      "key": "OilConsumptionHistory",
      "value": {
        "type": "object",
        "properties": {
          "value": {
            "type": "string",
            "title": "油耗"
          },
          "dataTime": {
            "type": "string",
            "title": "数据时间"
          }
        },
        "required": [
          "value",
          "dataTime"
        ],
        "x-apifox-orders": [
          "value",
          "dataTime"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    },
    {
      "key": "LocationHistory",
      "value": {
        "type": "object",
        "properties": {
          "lat": {
            "type": "string",
            "title": "纬度"
          },
          "lng": {
            "type": "string",
            "title": "经度"
          },
          "dataTime": {
            "type": "string",
            "title": "数据时间"
          }
        },
        "required": [
          "lat",
          "lng",
          "dataTime"
        ],
        "x-apifox-orders": [
          "lat",
          "lng",
          "dataTime"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    },
    {
      "key": "simpleDeviceListResp",
      "value": {
        "type": "object",
        "properties": {
          "deviceId": {
            "type": "integer",
            "title": "设备id"
          },
          "deviceName": {
            "type": "string",
            "title": "设备名"
          },
          "pic": {
            "type": "string",
            "title": "图片"
          }
        },
        "required": [
          "deviceId",
          "deviceName",
          "pic"
        ],
        "x-apifox-orders": [
          "deviceId",
          "deviceName",
          "pic"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    },
    {
      "key": "deviceLatestCaptureResp",
      "value": {
        "type": "object",
        "properties": {
          "monitorId": {
            "type": "string",
            "title": "摄像头id"
          },
          "monitorInfo": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "channel": {
                  "type": "integer",
                  "title": "通道id"
                },
                "url": {
                  "type": "string",
                  "title": "图片地址"
                },
                "status": {
                  "type": "string",
                  "title": "状态"
                },
                "desc": {
                  "type": "string",
                  "title": "描述"
                }
              },
              "required": [
                "channel",
                "url",
                "status",
                "desc"
              ],
              "x-apifox-orders": [
                "channel",
                "url",
                "status",
                "desc"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "监控信息"
          }
        },
        "required": [
          "monitorId",
          "monitorInfo"
        ],
        "x-apifox-orders": [
          "monitorId",
          "monitorInfo"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    },
    {
      "key": "deviceCaptureResp",
      "value": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "title": "抓拍时间"
          },
          "urls": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "抓拍照片"
          }
        },
        "required": [
          "title",
          "urls"
        ],
        "x-apifox-orders": [
          "title",
          "urls"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    },
    {
      "key": "deviceStatisticsResp",
      "value": {
        "type": "object",
        "properties": {
          "overviewList": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "title": "标题"
                },
                "value": {
                  "type": "number",
                  "title": "属性值"
                },
                "tip": {
                  "type": "string",
                  "title": "提示"
                }
              },
              "required": [
                "title",
                "value",
                "tip"
              ],
              "x-apifox-orders": [
                "title",
                "value",
                "tip"
              ],
              "x-apifox-ignore-properties": []
            },
            "title": "概述列表"
          },
          "workingHoursCurve": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string",
                "title": "标题"
              },
              "chartData": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "title": "横坐标"
                    },
                    "value": {
                      "type": "number",
                      "title": "纵坐标"
                    },
                    "text": {
                      "type": "string",
                      "title": "文本内容"
                    }
                  },
                  "required": [
                    "title",
                    "value",
                    "text"
                  ],
                  "x-apifox-orders": [
                    "title",
                    "value",
                    "text"
                  ],
                  "x-apifox-ignore-properties": []
                },
                "title": "表数据"
              }
            },
            "required": [
              "title",
              "chartData"
            ],
            "x-apifox-orders": [
              "title",
              "chartData"
            ],
            "title": "工作时间曲线",
            "x-apifox-ignore-properties": []
          },
          "oilConsumptionCurve": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string",
                "title": "标题"
              },
              "chartData": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "title": "横坐标"
                    },
                    "value": {
                      "type": "number",
                      "title": "纵坐标"
                    },
                    "text": {
                      "type": "string",
                      "title": "文本"
                    }
                  },
                  "required": [
                    "title",
                    "value",
                    "text"
                  ],
                  "x-apifox-orders": [
                    "title",
                    "value",
                    "text"
                  ],
                  "x-apifox-ignore-properties": []
                },
                "title": "表数据"
              }
            },
            "required": [
              "title",
              "chartData"
            ],
            "x-apifox-orders": [
              "title",
              "chartData"
            ],
            "title": "油耗曲线",
            "x-apifox-ignore-properties": []
          },
          "stateDistribution": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string",
                "title": "标题"
              },
              "chartData": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "title": "状态"
                    },
                    "value": {
                      "type": "integer",
                      "title": "状态个数"
                    },
                    "text": {
                      "type": "string",
                      "title": "文本"
                    }
                  },
                  "x-apifox-orders": [
                    "title",
                    "value",
                    "text"
                  ],
                  "x-apifox-ignore-properties": []
                },
                "title": "表数据"
              }
            },
            "required": [
              "title",
              "chartData"
            ],
            "x-apifox-orders": [
              "title",
              "chartData"
            ],
            "title": "状态分布",
            "x-apifox-ignore-properties": []
          },
          "deviceDistribution": {
            "type": "object",
            "properties": {
              "title": {
                "type": "string",
                "title": "标题"
              },
              "chartData": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "title": {
                      "type": "string",
                      "title": "城市"
                    },
                    "value": {
                      "type": "integer",
                      "title": "设备数量"
                    },
                    "text": {
                      "type": "string",
                      "title": "文本"
                    }
                  },
                  "required": [
                    "title",
                    "value",
                    "text"
                  ],
                  "x-apifox-orders": [
                    "title",
                    "value",
                    "text"
                  ],
                  "x-apifox-ignore-properties": []
                },
                "title": "表数据"
              }
            },
            "required": [
              "title",
              "chartData"
            ],
            "x-apifox-orders": [
              "title",
              "chartData"
            ],
            "title": "设备分布",
            "x-apifox-ignore-properties": []
          }
        },
        "required": [
          "overviewList",
          "workingHoursCurve",
          "oilConsumptionCurve",
          "stateDistribution",
          "deviceDistribution"
        ],
        "x-apifox-orders": [
          "overviewList",
          "workingHoursCurve",
          "oilConsumptionCurve",
          "stateDistribution",
          "deviceDistribution"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    },
    {
      "key": "deviceHistoryResp1",
      "value": {
        "type": "object",
        "properties": {
          "companyId": {
            "type": "integer",
            "title": "公司id"
          },
          "deviceId": {
            "type": "integer",
            "title": "设备id"
          },
          "vinCode": {
            "type": "string",
            "title": "暂无用"
          },
          "workingStatus": {
            "type": "string",
            "title": "工作状态"
          },
          "lat": {
            "type": "string",
            "title": "纬度"
          },
          "lng": {
            "type": "string",
            "title": "经度"
          },
          "oilConsumption": {
            "type": "string",
            "title": "油耗"
          },
          "speed": {
            "type": "string",
            "title": "速度"
          },
          "engineHours": {
            "type": "string",
            "title": "工作时间"
          },
          "time": {
            "type": "string",
            "title": "时间"
          }
        },
        "required": [
          "companyId",
          "deviceId",
          "vinCode",
          "workingStatus",
          "lat",
          "lng",
          "oilConsumption",
          "speed",
          "engineHours",
          "time"
        ],
        "x-apifox-orders": [
          "companyId",
          "deviceId",
          "vinCode",
          "workingStatus",
          "lat",
          "lng",
          "oilConsumption",
          "speed",
          "engineHours",
          "time"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    },
    {
      "key": "deviceLiveDataResp",
      "value": {
        "type": "object",
        "properties": {
          "vehicleSpeed": {
            "type": "string",
            "title": "车速"
          },
          "batteryVoltage": {
            "type": "string",
            "title": "蓄电池电压"
          },
          "engineTemperature": {
            "type": "string",
            "title": "发动机温度"
          },
          "fuelConsumptionRate": {
            "type": "string",
            "title": "燃油消耗率"
          },
          "engineSpeed": {
            "type": "string",
            "title": "发动机转速"
          },
          "oilPressure": {
            "type": "string",
            "title": "机油压力"
          },
          "workingStatus": {
            "type": "string",
            "title": "工作状态"
          },
          "failureCount": {
            "type": "string",
            "title": "故障次数"
          },
          "faultMessageList": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "故障列表",
            "nullable": true
          },
          "totalEngineWorkHours": {
            "type": "string",
            "title": "总工作时长"
          },
          "totalOilConsumption": {
            "type": "string",
            "title": "总油耗"
          },
          "liveDataGroup": {
            "type": "string",
            "title": "是否是实时数据"
          },
          "location": {
            "type": "string",
            "title": "位置"
          },
          "dataTime": {
            "type": "string",
            "title": "时间"
          }
        },
        "required": [
          "vehicleSpeed",
          "batteryVoltage",
          "engineTemperature",
          "fuelConsumptionRate",
          "engineSpeed",
          "oilPressure",
          "workingStatus",
          "failureCount",
          "faultMessageList",
          "totalEngineWorkHours",
          "totalOilConsumption",
          "liveDataGroup",
          "location",
          "dataTime"
        ],
        "x-apifox-orders": [
          "vehicleSpeed",
          "batteryVoltage",
          "engineTemperature",
          "fuelConsumptionRate",
          "engineSpeed",
          "oilPressure",
          "workingStatus",
          "failureCount",
          "faultMessageList",
          "totalEngineWorkHours",
          "totalOilConsumption",
          "liveDataGroup",
          "location",
          "dataTime"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    },
    {
      "key": "deviceDetailResp",
      "value": {
        "type": "object",
        "properties": {
          "deviceId": {
            "type": "integer",
            "title": "设备id"
          },
          "deviceName": {
            "type": "string",
            "title": "设备名"
          },
          "pic": {
            "type": "string",
            "title": "图片"
          },
          "deviceType": {
            "type": "string",
            "title": "设备类型"
          },
          "modelNo": {
            "type": "string",
            "title": "型号"
          },
          "brand": {
            "type": "string",
            "title": "品牌"
          },
          "area": {
            "type": "string",
            "title": "区域"
          },
          "location": {
            "type": "string",
            "title": "地理位置"
          }
        },
        "required": [
          "deviceId",
          "deviceName",
          "pic",
          "deviceType",
          "modelNo",
          "brand",
          "area",
          "location"
        ],
        "x-apifox-orders": [
          "deviceId",
          "deviceName",
          "pic",
          "deviceType",
          "modelNo",
          "brand",
          "area",
          "location"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/device"
      }
    }
  ],
  "/entitys/app/maintain": [
    {
      "key": "MaintenanceListResp",
      "value": {
        "type": "object",
        "properties": {
          "maintenance_id": {
            "type": "integer",
            "title": "保养id"
          },
          "work_hours": {
            "type": "string",
            "title": "工作时长"
          },
          "content": {
            "type": "string",
            "title": "保养内容"
          },
          "expenses": {
            "type": "string",
            "title": "费用"
          },
          "attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "图片地址"
          },
          "last_maintenance_time": {
            "type": "string",
            "title": "上一次保养时间"
          },
          "maintenance_time": {
            "type": "string",
            "title": "保养时间"
          },
          "remark": {
            "type": "string",
            "title": "备注"
          }
        },
        "required": [
          "maintenance_id",
          "work_hours",
          "content",
          "expenses",
          "attachment",
          "maintenance_time",
          "last_maintenance_time",
          "remark"
        ],
        "x-apifox-orders": [
          "maintenance_id",
          "work_hours",
          "content",
          "expenses",
          "attachment",
          "last_maintenance_time",
          "maintenance_time",
          "remark"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/保养"
      }
    },
    {
      "key": "CreateMaintenanceReq",
      "value": {
        "type": "object",
        "properties": {
          "device_id": {
            "type": "integer",
            "title": "设备id"
          },
          "work_hours": {
            "type": "string",
            "title": "工作时长"
          },
          "content": {
            "type": "string",
            "title": "保养内容"
          },
          "expenses": {
            "type": "string",
            "title": "费用"
          },
          "attachment": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "title": "图片地址"
          },
          "last_maintenance_time": {
            "type": "string",
            "title": "上一次保养时间"
          },
          "maintenance_time": {
            "type": "string",
            "title": "本次保养时间"
          },
          "remark": {
            "type": "string",
            "title": "备注"
          }
        },
        "required": [
          "device_id",
          "work_hours",
          "content",
          "expenses",
          "attachment",
          "last_maintenance_time",
          "maintenance_time",
          "remark"
        ],
        "x-apifox-orders": [
          "device_id",
          "work_hours",
          "content",
          "expenses",
          "attachment",
          "last_maintenance_time",
          "maintenance_time",
          "remark"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/保养"
      }
    }
  ],
  "/entitys/app/driver": [
    {
      "key": "driverListResp",
      "value": {
        "type": "object",
        "properties": {
          "driverId": {
            "type": "integer",
            "title": "驾驶员id"
          },
          "driverName": {
            "type": "string",
            "title": "驾驶员名"
          },
          "phone": {
            "type": "string",
            "title": "手机号"
          },
          "idCard": {
            "type": "string",
            "title": "身份证"
          },
          "operationCertificate": {
            "type": "string",
            "title": "操作证"
          }
        },
        "required": [
          "driverId",
          "driverName",
          "phone",
          "idCard",
          "operationCertificate"
        ],
        "x-apifox-orders": [
          "driverId",
          "driverName",
          "phone",
          "idCard",
          "operationCertificate"
        ],
        "x-apifox-ignore-properties": [],
        "x-apifox-folder": "app接口模型/driver"
      }
    }
  ]
};
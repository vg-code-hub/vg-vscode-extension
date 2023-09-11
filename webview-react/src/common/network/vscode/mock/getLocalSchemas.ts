/*
 * @Author: zdd
 * @Date: 2023-07-20 11:41:52
 * @LastEditors: jimmyZhao
 * @LastEditTime: 2023-09-10 13:41:16
 * @FilePath: /vg-vscode-extension/webview-react/src/common/network/vscode/mock/getLocalSchemas.ts
 * @Description:
 */
export default {
  '/api_business/project': [
    [
      {
        path: '/project/finish',
        methodName: 'updateProjectFinish',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'FinishProjectReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.FinishProjectReq',
          },
        },
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '项目完工',
        description: '',
      },
      {
        path: '/project/logs',
        methodName: 'getProjectLogs',
        pathParams: [],
        queryParams: [
          {
            name: 'projectId',
            type: 'int',
            description: '项目日志请求体',
            require: true,
          },
          {
            name: 'page',
            type: 'int',
            description: '页标',
            require: true,
          },
          {
            name: 'size',
            type: 'int',
            description: '页大小',
            require: true,
          },
        ],
        returnType: {
          type: 'ProjectLoggerRes',
          isPagination: true,
          isList: true,
        },
        summary: '项目日志',
        description: '',
      },
      {
        path: '/project/projects',
        methodName: 'getProjectProjects',
        pathParams: [],
        queryParams: [
          {
            name: 'keyword',
            type: 'String',
            description: '关键词:支持项目编号，项目名称，业务员，客户名',
            require: false,
          },
          {
            name: 'status',
            type: 'String',
            description: '项目状态',
            require: false,
          },
          {
            name: 'page',
            type: 'int',
            description: '页标',
            require: true,
          },
          {
            name: 'size',
            type: 'int',
            description: '页大小',
            require: true,
          },
        ],
        returnType: {
          type: 'FindProjectRes',
          isPagination: true,
          isList: true,
        },
        summary: '项目列表',
        description: '',
      },
      {
        path: '/project/projects',
        methodName: 'updateProjectProjects',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'UpdateProjectReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.UpdateProjectReq',
          },
        },
        returnType: {
          type: 'UpdateProjectRes',
          isPagination: false,
          isList: false,
        },
        summary: '更新项目',
        description: '',
      },
      {
        path: '/project/projects',
        methodName: 'createProjectProjects',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'CreateProjectReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.CreateProjectReq',
          },
        },
        returnType: {
          type: 'CreateProjectRes',
          isPagination: false,
          isList: false,
        },
        summary: '创建项目',
        description: '',
      },
      {
        path: '/project/projects/{id}',
        methodName: 'getProjectProjectsId',
        pathParams: [
          {
            name: 'id',
            type: 'int',
            description: '项目id',
            require: true,
          },
        ],
        queryParams: [],
        returnType: {
          type: 'ProjectDetailRes',
          isPagination: false,
          isList: false,
        },
        summary: '项目详情',
        description: '',
      },
      {
        path: '/project/projects/{id}',
        methodName: 'deleteProjectProjectsId',
        pathParams: [
          {
            name: 'id',
            type: 'int',
            description: '项目id',
            require: true,
          },
        ],
        queryParams: [],
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '删除项目',
        description: '',
      },
    ],
    [
      {
        name: 'FinishProjectReq',
        schema: {
          type: 'object',
          properties: {
            id: {
              description: '项目id',
              type: 'integer',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'ProjectLoggerRes',
        schema: {
          type: 'object',
          properties: {
            id: {
              description: '日志id',
              type: 'integer',
            },
            msg: {
              description: '信息',
              type: 'string',
            },
            oper_time: {
              description: '操作时间',
              type: 'string',
            },
            request_method: {
              description: '请求方法',
              type: 'string',
            },
            user_id: {
              description: '操作人id',
              type: 'integer',
            },
            username: {
              description: '操作人名字',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'FindProjectRes',
        schema: {
          type: 'object',
          properties: {
            code: {
              description: '项目编码',
              type: 'string',
            },
            company_id: {
              description: '公司id',
              type: 'integer',
            },
            creator: {
              description: '创建人（业务员）',
              type: 'string',
            },
            creator_id: {
              description: '创建人id（业务员id）',
              type: 'integer',
            },
            devices: {
              description: '设备',
              type: 'string',
            },
            district: {
              description: '区域',
              type: 'string',
            },
            district_id: {
              description: '区域id',
              type: 'integer',
            },
            drivers: {
              description: '驾驶员',
              type: 'string',
            },
            id: {
              description: '项目id',
              type: 'integer',
            },
            lat: {
              description: '纬度',
              type: 'number',
            },
            lessee_name: {
              description: '客户名',
              type: 'string',
            },
            lng: {
              description: '经度',
              type: 'number',
            },
            location: {
              description: '位置',
              type: 'string',
            },
            project_name: {
              description: '项目名',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            rent_from: {
              description: '承租开始时间',
              type: 'string',
            },
            rent_to: {
              description: '承租结束时间',
              type: 'string',
            },
            status: {
              description:
                '项目状态,待调度:wait_scheduling,进行中:executing,已完工:finish',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'UpdateProjectRes',
        schema: {
          type: 'object',
          properties: {
            code: {
              description: '项目编码',
              type: 'string',
            },
            company_id: {
              description: '公司id',
              type: 'integer',
            },
            creator: {
              description: '创建人（业务员）',
              type: 'string',
            },
            creator_id: {
              description: '创建人id（业务员id）',
              type: 'integer',
            },
            district: {
              description: '区域',
              type: 'string',
            },
            district_id: {
              description: '区域id',
              type: 'integer',
            },
            id: {
              description: '项目id',
              type: 'integer',
            },
            lat: {
              description: '纬度',
              type: 'number',
            },
            lessee_name: {
              description: '客户名',
              type: 'string',
            },
            lng: {
              description: '经度',
              type: 'number',
            },
            location: {
              description: '位置',
              type: 'string',
            },
            project_name: {
              description: '项目名',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            rent_from: {
              description: '承租开始时间',
              type: 'string',
            },
            rent_to: {
              description: '承租结束时间',
              type: 'string',
            },
            status: {
              description:
                '项目状态,待调度:wait_scheduling,进行中:executing,已完工:finish',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'UpdateProjectReq',
        schema: {
          type: 'object',
          required: ['id'],
          properties: {
            id: {
              description: '项目id',
              type: 'integer',
            },
            lat: {
              description: '施工地点纬度',
              type: 'number',
            },
            lessee_name: {
              description: '客户名',
              type: 'string',
            },
            lng: {
              description: '施工地点经度',
              type: 'number',
            },
            location: {
              description: '施工地点位置',
              type: 'string',
            },
            project_name: {
              description: '项目名',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            rent_from: {
              description: '承租开始时间',
              type: 'string',
            },
            rent_to: {
              description: '承租结束时间',
              type: 'string',
            },
            requirements: {
              description: '设备需求',
              type: 'array',
              items: {
                $ref: '#/components/schemas/v1.RequirementReq',
              },
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'RequirementReq',
        schema: {
          type: 'object',
          required: ['device_type', 'pricing_type'],
          properties: {
            device_type: {
              description: '设备类型',
              type: 'string',
            },
            id: {
              description: '设备需求id',
              type: 'integer',
            },
            pricing_type: {
              description: '计费单位',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'CreateProjectRes',
        schema: {
          type: 'object',
          properties: {
            code: {
              description: '项目编码',
              type: 'string',
            },
            company_id: {
              description: '公司id',
              type: 'integer',
            },
            creator: {
              description: '创建人（业务员）',
              type: 'string',
            },
            creator_id: {
              description: '创建人id（业务员id）',
              type: 'integer',
            },
            district: {
              description: '区域',
              type: 'string',
            },
            district_id: {
              description: '区域id',
              type: 'integer',
            },
            id: {
              description: '项目id',
              type: 'integer',
            },
            lat: {
              description: '纬度',
              type: 'number',
            },
            lessee_name: {
              description: '客户名',
              type: 'string',
            },
            lng: {
              description: '经度',
              type: 'number',
            },
            location: {
              description: '位置',
              type: 'string',
            },
            project_name: {
              description: '项目名',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            rent_from: {
              description: '承租开始时间',
              type: 'string',
            },
            rent_to: {
              description: '承租结束时间',
              type: 'string',
            },
            status: {
              description:
                '项目状态,待调度:wait_scheduling,进行中:executing,已完工:finish',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'CreateProjectReq',
        schema: {
          type: 'object',
          required: [
            'lat',
            'lessee_name',
            'lng',
            'location',
            'project_name',
            'rent_from',
            'rent_to',
            'requirements',
          ],
          properties: {
            lat: {
              description: '施工地点纬度',
              type: 'number',
            },
            lessee_name: {
              description: '客户名',
              type: 'string',
            },
            lng: {
              description: '施工地点经度',
              type: 'number',
            },
            location: {
              description: '施工地点位置',
              type: 'string',
            },
            project_name: {
              description: '项目名',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            rent_from: {
              description: '承租开始时间',
              type: 'string',
            },
            rent_to: {
              description: '承租结束时间',
              type: 'string',
            },
            requirements: {
              description: '设备需求',
              type: 'array',
              items: {
                $ref: '#/components/schemas/v1.RequirementReq',
              },
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'ProjectDetailRes',
        schema: {
          type: 'object',
          properties: {
            code: {
              description: '项目编码',
              type: 'string',
            },
            company_id: {
              description: '公司id',
              type: 'integer',
            },
            creator: {
              description: '创建人（业务员）',
              type: 'string',
            },
            creator_id: {
              description: '创建人id（业务员id）',
              type: 'integer',
            },
            district: {
              description: '区域',
              type: 'string',
            },
            district_id: {
              description: '区域id',
              type: 'integer',
            },
            id: {
              description: '项目id',
              type: 'integer',
            },
            lat: {
              description: '纬度',
              type: 'number',
            },
            lessee_name: {
              description: '客户名',
              type: 'string',
            },
            lng: {
              description: '经度',
              type: 'number',
            },
            location: {
              description: '位置',
              type: 'string',
            },
            project_name: {
              description: '项目名',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            rent_from: {
              description: '承租开始时间',
              type: 'string',
            },
            rent_to: {
              description: '承租结束时间',
              type: 'string',
            },
            requirements: {
              description: '设备需求列表',
              type: 'array',
              items: {
                $ref: '#/components/schemas/v1.RequirementRes',
              },
            },
            schedules: {
              description: '设备调度列表',
              type: 'array',
              items: {
                $ref: '#/components/schemas/v1.ScheduleRes',
              },
            },
            status: {
              description:
                '项目状态,待调度:wait_scheduling,进行中:executing,已完工:finish',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'RequirementRes',
        schema: {
          type: 'object',
          required: ['device_type', 'pricing_type'],
          properties: {
            device_type: {
              description: '设备类型',
              type: 'string',
            },
            id: {
              description: '设备需求id',
              type: 'integer',
            },
            pricing_type: {
              description: '计费单位',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'ScheduleRes',
        schema: {
          type: 'object',
          properties: {
            day: {
              description: '调度日期',
              type: 'string',
            },
            device_id: {
              description: '设备id',
              type: 'integer',
            },
            device_name: {
              description: '设备名',
              type: 'string',
            },
            device_pic: {
              description: '设备图片',
              type: 'string',
            },
            device_type: {
              description: '设备需求类型',
              type: 'string',
            },
            driver_id: {
              description: '驾驶员id',
              type: 'string',
            },
            driver_mobile: {
              description: '驾驶员手机号',
              type: 'string',
            },
            driver_name: {
              description: '驾驶员名字',
              type: 'string',
            },
            price_type: {
              description: '计费单位',
              type: 'string',
            },
            project_id: {
              description: '项目id',
              type: 'integer',
            },
            project_name: {
              description: '项目名',
              type: 'string',
            },
            requirement_id: {
              description: '设备需求id',
              type: 'integer',
            },
            schedule_plan_id: {
              description: '调度计划id',
              type: 'integer',
            },
            schedule_status: {
              description: '调度状态，already:已调度enter:已进场exit:已退场',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
    ],
  ],
  '/api_business/schedule': [
    [
      {
        path: '/schedule/schedules',
        methodName: 'updateScheduleSchedules',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'UpdateScheduleReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.UpdateScheduleReq',
          },
        },
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '调度',
        description: '包含创建，更新，删除，在服务端做diff操作',
      },
    ],
    [
      {
        name: 'UpdateScheduleReq',
        schema: {
          type: 'object',
          required: [
            'device_id',
            'driver_id',
            'driver_name',
            'project_id',
            'requirement_id',
          ],
          properties: {
            device_id: {
              description: '设备id',
              type: 'integer',
            },
            device_name: {
              description: '设备名',
              type: 'string',
            },
            driver_id: {
              description: '驾驶员id',
              type: 'array',
              items: {
                type: 'integer',
              },
            },
            driver_name: {
              description: '驾驶员姓名',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            project_id: {
              description: '项目id',
              type: 'integer',
            },
            requirement_id: {
              description: '设备需求id',
              type: 'integer',
            },
            scheduling_date: {
              description: '调度日期',
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
    ],
  ],
  '/api_business/work': [
    [
      {
        path: '/work/enter_exit',
        methodName: 'createWorkEnterExit',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'CreateEnterExitReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.CreateEnterExitReq',
          },
        },
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '创建进退场登记',
        description: '',
      },
      {
        path: '/work/enter_exit',
        methodName: 'updateWorkEnterExit',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'UpdateEnterExitReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.UpdateEnterExitReq',
          },
        },
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '更新进退场登记',
        description: '',
      },
      {
        path: '/work/enter_exit/{id}',
        methodName: 'getWorkEnterExitId',
        pathParams: [
          {
            name: 'id',
            type: 'int',
            description: '进退场id',
            require: true,
          },
        ],
        queryParams: [],
        returnType: {
          type: 'EnterExitDetailRes',
          isPagination: false,
          isList: false,
        },
        summary: '进退场登记详情',
        description: '',
      },
      {
        path: '/work/register',
        methodName: 'getWorkRegister',
        pathParams: [],
        queryParams: [
          {
            name: 'planId',
            type: 'int',
            description: '调度计划id',
            require: false,
          },
        ],
        returnType: {
          type: 'FindWorkRegisterRes',
          isPagination: false,
          isList: false,
        },
        summary: '工作登记',
        description: '',
      },
      {
        path: '/work/register',
        methodName: 'updateWorkRegister',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'UpdateWorkRegisterReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.UpdateWorkRegisterReq',
          },
        },
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '更新工作登记',
        description: '',
      },
      {
        path: '/work/register',
        methodName: 'createWorkRegister',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'CreateWorkRegisterReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.CreateWorkRegisterReq',
          },
        },
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '创建工作登记',
        description: '',
      },
      {
        path: '/work/register/{id}',
        methodName: 'getWorkRegisterId',
        pathParams: [
          {
            name: 'id',
            type: 'int',
            description: '工作登记id',
            require: true,
          },
        ],
        queryParams: [],
        returnType: {
          type: 'WorkRegisterDetailRes',
          isPagination: false,
          isList: false,
        },
        summary: '工作登记明细',
        description: '',
      },
    ],
    [
      {
        name: 'CreateEnterExitReq',
        schema: {
          type: 'object',
          required: [
            'attachment',
            'device_check_attachment',
            'fuel_attachment',
            'oil_volume',
            'registration_time',
            'schedule_plan_id',
            'total_engine_hours',
            'type',
          ],
          properties: {
            attachment: {
              description: '发动机工作图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            device_check_attachment: {
              description: '设备检查图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fuel_attachment: {
              description: '燃油量图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            oil_volume: {
              description: '燃油量',
              type: 'number',
            },
            registration_time: {
              description: '进场时间',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            schedule_plan_id: {
              description: '调度计划id',
              type: 'integer',
            },
            total_engine_hours: {
              description: '发动机总工作时长',
              type: 'number',
            },
            type: {
              description: '类型，进场：enter，退场：exit',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'UpdateEnterExitReq',
        schema: {
          type: 'object',
          required: ['id'],
          properties: {
            attachment: {
              description: '发动机工作图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            device_check_attachment: {
              description: '设备检查图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fuel_attachment: {
              description: '燃油量图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            id: {
              description: '进退场id',
              type: 'integer',
            },
            oil_volume: {
              description: '燃油量',
              type: 'number',
            },
            registration_time: {
              description: '进场时间',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            total_engine_hours: {
              description: '发动机总工作时长',
              type: 'number',
            },
            type: {
              description: '类型，进场：enter，退场：exit',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'EnterExitDetailRes',
        schema: {
          type: 'object',
          properties: {
            attachment: {
              description: '发动机工作图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            device_check_attachment: {
              description: '设备检查图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fuel_attachment: {
              description: '燃油量图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            id: {
              description: '进退场登记id',
              type: 'integer',
            },
            oil_volume: {
              description: '燃油量',
              type: 'number',
            },
            registration_time: {
              description: '进场时间',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            total_engine_hours: {
              description: '发动机总工作时长',
              type: 'number',
            },
            type: {
              description: '类型，进场：enter，退场：exit',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'FindWorkRegisterRes',
        schema: {
          type: 'object',
          properties: {
            device_name: {
              description: '设备名称',
              type: 'string',
            },
            driver: {
              description: '驾驶员',
              type: 'string',
            },
            enter_register: {
              description: '进场登记',
              allOf: [
                {
                  $ref: '#/components/schemas/v1.EnterExitRegisterRes',
                },
              ],
            },
            exit_register: {
              description: '退场登记',
              allOf: [
                {
                  $ref: '#/components/schemas/v1.EnterExitRegisterRes',
                },
              ],
            },
            location: {
              description: '施工位置',
              type: 'string',
            },
            project_name: {
              description: '项目名',
              type: 'string',
            },
            project_status: {
              description: '项目状态',
              type: 'string',
            },
            work_register: {
              description: '工作登记',
              type: 'array',
              items: {
                $ref: '#/components/schemas/v1.WorkRegisterRes',
              },
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'EnterExitRegisterRes',
        schema: {
          type: 'object',
          properties: {
            attachment: {
              description: '发动机工作图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            device_check_attachment: {
              description: '设备检查图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fuel_attachment: {
              description: '燃油量图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            id: {
              description: '进退场登记id',
              type: 'integer',
            },
            oil_volume: {
              description: '燃油量',
              type: 'number',
            },
            registration_time: {
              description: '进场时间',
              type: 'string',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            total_engine_hours: {
              description: '发动机总工作时长',
              type: 'number',
            },
            type: {
              description: '类型，进场：enter，退场：exit',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'WorkRegisterRes',
        schema: {
          type: 'object',
          properties: {
            attachment: {
              description: '平方数图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            device_check_attachment: {
              description: '设备检查图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            driver_name: {
              description: '驾驶员姓名',
              type: 'string',
            },
            engine_attachment: {
              description: '发动机工作总时长图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fuel_consumption: {
              description: '今日油耗',
              type: 'number',
            },
            fuel_consumption_attachment: {
              description: '今日油耗图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            id: {
              description: '工作登记id',
              type: 'integer',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            schedule_id: {
              description: '调度id',
              type: 'integer',
            },
            square_amount: {
              description: '平方数',
              type: 'number',
            },
            total_engine_hours: {
              description: '发动机工作总时长',
              type: 'number',
            },
            work_day: {
              description: '工作时间',
              type: 'string',
            },
            work_sheet_amount: {
              description: '台班数量',
              type: 'number',
            },
            work_status: {
              description: '工作状态,施工：work，怠工：not_work',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'UpdateWorkRegisterReq',
        schema: {
          type: 'object',
          required: ['id'],
          properties: {
            attachment: {
              description: '平方数图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            device_check_attachment: {
              description: '设备检查图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            engine_attachment: {
              description: '发动机工作总时长图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fuel_consumption: {
              description: '今日油耗',
              type: 'number',
            },
            fuel_consumption_attachment: {
              description: '今日油耗图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            id: {
              description: '工作登记id',
              type: 'integer',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            square_amount: {
              description: '平方数',
              type: 'number',
            },
            total_engine_hours: {
              description: '发动机工作总时长',
              type: 'number',
            },
            work_day: {
              description: '工作时间',
              type: 'string',
            },
            work_sheet_amount: {
              description: '台班数量',
              type: 'number',
            },
            work_status: {
              description: '工作状态,施工：work，怠工：not_work',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'CreateWorkRegisterReq',
        schema: {
          type: 'object',
          required: [
            'device_check_attachment',
            'engine_attachment',
            'fuel_consumption',
            'fuel_consumption_attachment',
            'schedule_id',
            'total_engine_hours',
            'work_status',
          ],
          properties: {
            attachment: {
              description: '平方数图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            device_check_attachment: {
              description: '设备检查图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            engine_attachment: {
              description: '发动机工作总时长图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fuel_consumption: {
              description: '今日油耗',
              type: 'number',
            },
            fuel_consumption_attachment: {
              description: '今日油耗图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            schedule_id: {
              description: '调度id',
              type: 'integer',
            },
            square_amount: {
              description: '平方数',
              type: 'number',
            },
            total_engine_hours: {
              description: '发动机工作总时长',
              type: 'number',
            },
            work_sheet_amount: {
              description: '台班数量',
              type: 'number',
            },
            work_status: {
              description: '工作状态,施工：work，怠工：not_work',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'WorkRegisterDetailRes',
        schema: {
          type: 'object',
          properties: {
            attachment: {
              description: '平方数图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            device_check_attachment: {
              description: '设备检查图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            engine_attachment: {
              description: '发动机工作总时长图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fuel_consumption: {
              description: '今日油耗',
              type: 'number',
            },
            fuel_consumption_attachment: {
              description: '今日油耗图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            id: {
              description: '工作登记id',
              type: 'integer',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            square_amount: {
              description: '平方数',
              type: 'number',
            },
            total_engine_hours: {
              description: '发动机工作总时长',
              type: 'number',
            },
            work_day: {
              description: '工作时间',
              type: 'string',
            },
            work_sheet_amount: {
              description: '台班数量',
              type: 'number',
            },
            work_status: {
              description: '工作状态,施工：work，怠工：not_work',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
    ],
  ],
  '/api_business/repair': [
    [
      {
        path: '/repair/appoint',
        methodName: 'updateRepairAppoint',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'RepairAppointReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.RepairAppointReq',
          },
        },
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '报修指派',
        description: '',
      },
      {
        path: '/repair/documents',
        methodName: 'getRepairDocuments',
        pathParams: [],
        queryParams: [
          {
            name: 'deviceId',
            type: 'int',
            description: '设备id',
            require: true,
          },
          {
            name: 'page',
            type: 'int',
            description: '页标',
            require: true,
          },
          {
            name: 'size',
            type: 'int',
            description: '页大小',
            require: true,
          },
        ],
        returnType: {
          type: 'FindRepairDocumentRes',
          isPagination: true,
          isList: true,
        },
        summary: '维修列表',
        description: '',
      },
      {
        path: '/repair/repairers',
        methodName: 'getRepairRepairers',
        pathParams: [],
        queryParams: [],
        returnType: {
          type: 'RepairerRes',
          isPagination: false,
          isList: true,
        },
        summary: '报修人列表',
        description: '',
      },
      {
        path: '/repair/repairs',
        methodName: 'getRepairRepairs',
        pathParams: [],
        queryParams: [
          {
            name: 'deviceId',
            type: 'int',
            description: '设备id',
            require: true,
          },
          {
            name: 'page',
            type: 'int',
            description: '页标',
            require: true,
          },
          {
            name: 'size',
            type: 'int',
            description: '页大小',
            require: true,
          },
        ],
        returnType: {
          type: 'FindRepairRes',
          isPagination: true,
          isList: true,
        },
        summary: '报修列表',
        description: '',
      },
      {
        path: '/repair/repairs',
        methodName: 'createRepairRepairs',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'CreateRepairReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.CreateRepairReq',
          },
        },
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '新建报修',
        description: '',
      },
      {
        path: '/repair/document_registration',
        methodName: 'updateRepairDocumentRegistration',
        pathParams: [],
        queryParams: [],
        body: {
          name: 'body',
          type: 'RepairRegistrationReq',
          require: true,
          schema: {
            $ref: '#/components/schemas/v1.RepairRegistrationReq',
          },
        },
        returnType: {
          type: 'String',
          isPagination: false,
          isList: false,
        },
        summary: '维修登记',
        description: '',
      },
    ],
    [
      {
        name: 'RepairAppointReq',
        schema: {
          type: 'object',
          required: ['id', 'repairer_id', 'repairer_name'],
          properties: {
            id: {
              description: '报修id',
              type: 'integer',
            },
            remark: {
              description: '备注',
              type: 'string',
            },
            repairer_id: {
              description: '修理人id',
              type: 'integer',
            },
            repairer_name: {
              description: '修理人名字',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'FindRepairDocumentRes',
        schema: {
          type: 'object',
          properties: {
            id: {
              description: '维修单id',
              type: 'integer',
            },
            maintenance_attachments: {
              description: '维修图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            maintenance_content: {
              description: '维修内容',
              type: 'string',
            },
            maintenance_expenses: {
              description: '维修费用',
              type: 'number',
            },
            maintenance_fault_desc: {
              description: '维修故障描述',
              type: 'string',
            },
            maintenance_hours: {
              description: '维修工时',
              type: 'integer',
            },
            maintenance_method: {
              description: '维修方式',
              type: 'string',
            },
            maintenance_parts: {
              description: '维修配件',
              type: 'string',
            },
            maintenance_time: {
              description: '维修时间',
              type: 'string',
            },
            remark: {
              description: '维修备注',
              type: 'string',
            },
            repair: {
              description: '报修内容',
              allOf: [
                {
                  $ref: '#/components/schemas/v1.FindRepairRes',
                },
              ],
            },
            repairer_id: {
              description: '修理人id',
              type: 'integer',
            },
            repairer_name: {
              description: '修理人名字',
              type: 'string',
            },
            status: {
              description: '维修状态待维修:wait_repair,已维修:repaired',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'FindRepairRes',
        schema: {
          type: 'object',
          properties: {
            applicant_id: {
              description: '报修申请人id',
              type: 'integer',
            },
            applicant_name: {
              description: '报修申请人名字',
              type: 'string',
            },
            fault_attachments: {
              description: '故障图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fault_description: {
              description: '报修内容',
              type: 'string',
            },
            fault_level: {
              description: '故障等级',
              type: 'string',
            },
            id: {
              description: '报修id',
              type: 'integer',
            },
            repair_report_time: {
              description: '报修时间',
              type: 'string',
            },
            status: {
              description:
                '报修状态待确认:wait_confirm,待维修:wait_repair,已维修:repaired',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'RepairerRes',
        schema: {
          type: 'object',
          properties: {
            id: {
              description: '指派人id',
              type: 'integer',
            },
            real_name: {
              description: '指派人名字',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'CreateRepairReq',
        schema: {
          type: 'object',
          required: [
            'device_id',
            'fault_attachments',
            'fault_description',
            'fault_level',
          ],
          properties: {
            device_id: {
              description: '设备id',
              type: 'integer',
            },
            fault_attachments: {
              description: '故障图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            fault_description: {
              description: '故障内容',
              type: 'string',
            },
            fault_level: {
              description: '故障等级',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
      {
        name: 'RepairRegistrationReq',
        schema: {
          type: 'object',
          required: [
            'id',
            'maintenance_attachments',
            'maintenance_content',
            'maintenance_fault_desc',
            'maintenance_fee',
            'maintenance_hours',
            'maintenance_method',
            'maintenance_parts',
            'maintenance_time',
          ],
          properties: {
            id: {
              description: '维修id',
              type: 'integer',
            },
            maintenance_attachments: {
              description: '故障图片',
              type: 'array',
              items: {
                type: 'string',
              },
            },
            maintenance_content: {
              description: '维修内容',
              type: 'string',
            },
            maintenance_fault_desc: {
              description: '故障描述',
              type: 'string',
            },
            maintenance_fee: {
              description: '维修费用',
              type: 'number',
            },
            maintenance_hours: {
              description: '维修工时',
              type: 'integer',
            },
            maintenance_method: {
              description: '维修方式',
              type: 'string',
            },
            maintenance_parts: {
              description: '维修配件',
              type: 'string',
            },
            maintenance_time: {
              description: '维修时间',
              type: 'integer',
            },
            remark: {
              description: '维修备注',
              type: 'string',
            },
          },
          'x-apifox-folder': 'Schemas',
        },
      },
    ],
  ],
};

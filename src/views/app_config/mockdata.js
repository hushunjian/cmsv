let mockData = [{
    "name": "基础配置",
    "groupId": 1,
    "items": [{
        "key": "EXCHANGE_RATE",
        "value": 100,
        "des": "汇率(1RMB=?MB)"
      },
      {
        "key": "USER_PERMISSIONS",
        "value": {
          "levels": [{
              "icon": "http://cdn.me-to-me.com/lv_icon_1@3x.png",
              "level": 1,
              "name": "平民",
              "lvName": "Lv1",
              "needCoins": 5,
              "permissions": [
                5
              ]
            },
            {
              "icon": "http://cdn.me-to-me.com/lv_icon_2@3x.png",
              "level": 2,
              "name": "男爵",
              "lvName": "Lv2",
              "needCoins": 20,
              "permissions": [
                5
              ]
            },
            {
              "icon": "http://cdn.me-to-me.com/lv_icon_3@3x.png",
              "level": 3,
              "name": "子爵",
              "lvName": "Lv3",
              "needCoins": 50,
              "permissions": [
                5
              ]
            },
            {
              "icon": "http://cdn.me-to-me.com/lv_icon_4@3x.png",
              "level": 4,
              "name": "伯爵",
              "lvName": "Lv4",
              "needCoins": 100,
              "permissions": [
                5
              ]
            },
            {
              "icon": "http://cdn.me-to-me.com/lv_icon_5@3x.png",
              "level": 5,
              "name": "侯爵",
              "lvName": "Lv5",
              "needCoins": 130,
              "permissions": [
                5
              ]
            },
            {
              "icon": "http://cdn.me-to-me.com/lv_icon_6@3x.png",
              "level": 6,
              "name": "公爵",
              "lvName": "Lv6",
              "needCoins": 160,
              "permissions": [
                5
              ]
            },
            {
              "icon": "http://cdn.me-to-me.com/lv_icon_7@3x.png",
              "level": 7,
              "name": "郡王",
              "lvName": "Lv7",
              "needCoins": 200,
              "permissions": [
                5
              ]
            },
            {
              "icon": "http://cdn.me-to-me.com/lv_icon_8@3x.png",
              "level": 8,
              "name": "亲王",
              "lvName": "Lv8",
              "needCoins": 250,
              "permissions": [
                5
              ]
            },
            {
              "icon": "http://cdn.me-to-me.com/Lv_normal_k_3x.png",
              "level": 9,
              "name": "帝王",
              "lvName": "Lv9",
              "needCoins": 500,
              "permissions": [
                5
              ]
            }
          ]
        },
        "des": "用户权限清单"
      },
      {
        "key": "LEVEL_DEFINITION",
        "value": "你在米汤中的各种操作，都会获得米汤币，米汤币累积到一定等级，会解锁相应的功能权限。等级越高，权限也就越大。",
        "des": "等级定义"
      },
      {
        "key": "LISTED_START_TIME",
        "value": "09:00:00",
        "des": "王国上市交易开始时间"
      }
    ]
  },
  {
    "name": "用户等级权限配置",
    "groupId": 2,
    "items": [{
      "key": "LEVEL_1",
      "value": {
        "level": 1,
        "nodes": [{
            "code": 1,
            "isShow": 1,
            "minOpenLevel": 2,
            "name": "米汤专属表情包",
            "status": 0
          },
          {
            "code": 2,
            "isShow": 1,
            "minOpenLevel": 3,
            "name": "国王专属文字排版",
            "status": 0
          },
          {
            "code": 3,
            "isShow": 1,
            "minOpenLevel": 3,
            "name": "已拥有带水印下载",
            "status": 0
          },
          {
            "code": 4,
            "isShow": 1,
            "minOpenLevel": 1,
            "name": "5分钟超长语音",
            "seconds": 5,
            "status": 0
          },
          {
            "code": 5,
            "isShow": 1,
            "minOpenLevel": 4,
            "name": "发送视频",
            "status": 0
          },
          {
            "code": 6,
            "isShow": 1,
            "minOpenLevel": 4,
            "name": "私下单独聊聊",
            "status": 0
          },
          {
            "code": 7,
            "isShow": 1,
            "minOpenLevel": 5,
            "name": "10个聚合王国",
            "status": 0
          },
          {
            "code": 8,
            "isShow": 0,
            "minOpenLevel": 1,
            "name": "可偷王国数目",
            "num": 4,
            "status": 1
          },
          {
            "code": 9,
            "isShow": 0,
            "minOpenLevel": 1,
            "name": "单次偷取上限",
            "num": 1,
            "status": 1
          },
          {
            "code": 10,
            "isShow": 0,
            "minOpenLevel": 1,
            "name": "个人每日获取金币上限",
            "num": 30,
            "status": 1
          }
        ]
      },
      "des": "一级权限明细"
    }]
  },
  {
    "name": "操作分值配置",
    "groupId": 3,
    "items": [{
      "key": "TOPICFRAGMENTSCORE_0_0",
      "value": 3,
      "des": "主播发言"
    }]
  }
];

export default mockData;

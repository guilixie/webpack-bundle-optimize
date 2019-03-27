/**
 * 所有组件配置
 */

/* eslint-disable */
export default [{
    label: '(源)目标',
    icon: {
      class: 'glyphicon-folder-open',
      color: '#454545'
    },
    children: [{
        code: 'ZJ-101101',
        label: '数据源',
        icon: {
          class: 'glyphicon-book',
          color: '#7DC0EB'
        }
      },
      {
        code: 'ZJ-101102',
        label: '我的数据',
        icon: {
          class: 'glyphicon-user',
          color: '#7DC0EB'
        }
      }
    ]
  },
  {
    label: '数据处理',
    icon: {
      class: 'glyphicon-folder-open',
      color: '#454545'
    },
    children: [{
        code: 'ZJ-102101',
        label: '数据过滤',
        icon: {
          class: 'glyphicon-filter',
          color: '#D295E2'
        }
      },
      {
        code: 'ZJ-102102',
        label: '数据加工',
        icon: {
          class: 'glyphicon-link',
          color: '#D295E2'
        }
      },
      {
        code: 'ZJ-102103',
        label: '数据关联',
        icon: {
          class: 'glyphicon-paperclip',
          color: '#D295E2'
        }
      },
      {
        code: 'ZJ-102104',
        label: '数据分组',
        icon: {
          class: 'glyphicon-list',
          color: '#D295E2'
        }
      },
      {
        code: 'ZJ-102105',
        label: '数据排序',
        icon: {
          class: 'glyphicon-sort',
          color: '#D295E2'
        }
      },
      {
        code: 'ZJ-102106',
        label: '查询界限',
        icon: {
          class: 'glyphicon-road',
          color: '#D295E2'
        }
      },
      {
        code: 'ZJ-102107',
        label: '数据联合',
        icon: {
          class: 'glyphicon-compressed',
          color: '#D295E2'
        }
      },
      {
        code: 'ZJ-102108',
        label: '数据滤重',
        icon: {
          class: 'glyphicon-pushpin',
          color: '#D295E2'
        }
      },
      /* {
        code: 'ZJ-102109',
        label: '数据缺省',
        icon: {
          class: 'glyphicon-option-horizontal',
          color: '#D295E2'
        }
      } */
    ]
  },
  {
    label: '数据可视化',
    icon: {
      class: 'glyphicon-folder-open',
      color: '#454545'
    },
    children: [{
        code: 'ZJ-103101',
        label: '列表',
        icon: {
          class: 'glyphicon-list-alt',
          color: '#FF7741'
        }
      },
      {
        code: 'ZJ-103102',
        label: '图形',
        icon: {
          class: 'glyphicon-list',
          color: '#FF7741'
        }
      }
    ]
  },
/*
  {
    label: '统计分析',
    icon: {
      class: 'glyphicon-folder-open',
      color: '#454545'
    },
    children: [{
        code: 'ZJ-104101',
        label: '协方差',
        icon: {
          class: 'glyphicon-link',
          color: '#6FB7B7'
        }
      },
      {
        code: 'ZJ-104102',
        label: '方差',
        icon: {
          class: 'glyphicon-road',
          color: '#6FB7B7'
        }
      },
      {
        code: 'ZJ-104103',
        label: '求和',
        icon: {
          class: 'glyphicon-gbp',
          color: '#6FB7B7'
        }
      },
      {
        code: 'ZJ-104104',
        label: '全表统计',
        icon: {
          class: 'glyphicon-transfer',
          color: '#6FB7B7'
        }
      },
      {
        code: 'ZJ-104105',
        label: '正态检验',
        icon: {
          class: 'glyphicon-check',
          color: '#6FB7B7'
        }
      },
      {
        code: 'ZJ-104106',
        label: '直方图统计',
        icon: {
          class: 'glyphicon-align-left',
          color: '#6FB7B7'
        }
      },
      {
        code: 'ZJ-104107',
        label: '数据标准化',
        icon: {
          class: 'glyphicon-indent-right',
          color: '#6FB7B7'
        }
      },
      {
        code: 'ZJ-104108',
        label: '数据离散化',
        icon: {
          class: 'glyphicon-indent-left',
          color: '#6FB7B7'
        }
      }
    ]
  }, */
  /* {
    label: '机器学习（废除）',
    icon: {
      class: 'glyphicon-folder-open',
      color: '#454545'
    },
    children: [{
        code: 'ZJ-105101',
        label: 'K均值聚类',
        icon: {
          class: 'glyphicon-book',
          color: '#A6FFA6'
        }
      },
      {
        code: 'ZJ-105102',
        label: 'SVM向量机',
        icon: {
          class: 'glyphicon-pencil',
          color: '#A6FFA6'
        }
      },
      {
        code: 'ZJ-105103',
        label: '随机森林',
        icon: {
          class: 'glyphicon-user',
          color: '#A6FFA6'
        }
      },
      {
        code: 'ZJ-105104',
        label: '决策树',
        icon: {
          class: 'glyphicon-list',
          color: '#A6FFA6'
        }
      },
      {
        code: 'ZJ-105105',
        label: '关联规则',
        icon: {
          class: 'glyphicon-paperclip',
          color: '#A6FFA6'
        }
      },
      {
        code: 'ZJ-105106',
        label: '神经网络',
        icon: {
          class: 'glyphicon-link',
          color: '#A6FFA6'
        }
      },
      {
        code: 'ZJ-105103XX',
        label: '逻辑回归',
        icon: {
          class: 'glyphicon-screenshot',
          color: '#A6FFA6'
        }
      },
      {
        code: 'ZJ-105104xx',
        label: '朴素贝叶斯',
        icon: {
          class: 'glyphicon-leaf',
          color: '#A6FFA6'
        }
      }
    ]
  }, */
  {
    label: '机器学习',
    icon: {
      class: 'glyphicon-folder-open',
      color: '#454545'
    },
    children: [{
      code: 'ZJ-106101',
      label: 'K均值聚类',
      icon: {
        class: 'glyphicon-book',
        color: '#A6FFA6'
      }
    },
    {
      code: 'ZJ-106102',
      label: '逻辑回归',
      icon: {
        class: 'glyphicon-screenshot',
        color: '#A6FFA6'
      }
    }]
  }
];

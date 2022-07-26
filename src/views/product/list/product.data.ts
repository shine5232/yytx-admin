import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { rules } from '/@/utils/helper/validator';
import { render } from '/@/utils/common/renderUtils';

export const columns: BasicColumn[] = [
  {
    title: '产品名称',
    dataIndex: 'name',
    width: 120,
  },
  {
    title: '方案商',
    dataIndex: 'providerId',
    width: 100,
  },
  {
    title: '芯片No',
    dataIndex: 'chipNo',
    width: 120,
    auth:'product:chipNo'
  },
  {
    title: '客户',
    dataIndex: 'clientId',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    sorter: true,
    customRender: ({ text }) => {
      return render.renderDict(text, 'product_status');
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 120,
  },
];

export const recycleColumns: BasicColumn[] = [
  {
    title: '用户账号',
    dataIndex: 'username',
    width: 100,
  },
  {
    title: '用户姓名',
    dataIndex: 'realname',
    width: 100,
  },
  {
    title: '头像',
    dataIndex: 'avatar',
    width: 80,
    customRender: render.renderAvatar,
  },
  {
    title: '性别',
    dataIndex: 'sex',
    width: 80,
    sorter: true,
    customRender: ({ text }) => {
      return render.renderDict(text, 'sex');
    },
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    label: '查询类型',
    field: 'type',
    component: 'JSearchSelect',
    componentProps: {
      dictOptions: [
        {
          text: '产品名称查询',
          value: '1',
        },
        {
          text: '客户名称查询',
          value: '2',
        },
        {
          text: '方案商名称查询',
          value: '3',
        },
      ],
    },
    colProps: { span: 4 },
  },
  {
    label: '名称',
    field: 'text',
    component: 'JInput',
    colProps: { span: 4 },
  },
  {
    label: '产品状态',
    field: 'productType',
    component: 'JSearchSelect',
    componentProps: {
      dictOptions: [
        {
          text: '正式',
          value: '1',
        },
        {
          text: '审核中',
          value: '2',
        },
        {
          text: '禁用',
          value: '3',
        },
      ],
    },
    colProps: { span: 4 },
  }
];

export const formSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    label: '芯片No',
    field: 'chipNo',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入芯片No',
      },
    ],
  },
  {
    label: '产品名称',
    field: 'name',
    component: 'Input',
    rules: [
      {
        required: true,
        message: '请输入产品名称',
      },
    ],
  },
  {
    label: '状态',
    field: 'status',
    component: 'JDictSelectTag',
    componentProps: {
      dictCode: 'product_status',
      placeholder: '请选择状态',
      stringToNumber: true,
    },
  },
];

export const formPasswordSchema: FormSchema[] = [
  {
    label: '用户账号',
    field: 'username',
    component: 'Input',
    componentProps: { readOnly: true },
  },
  {
    label: '登录密码',
    field: 'password',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '请输入登录密码',
    },
    rules: [
      {
        required: true,
        message: '请输入登录密码',
      },
    ],
  },
  {
    label: '确认密码',
    field: 'confirmPassword',
    component: 'InputPassword',
    dynamicRules: ({ values }) => rules.confirmPassword(values, true),
  },
];

export const formAgentSchema: FormSchema[] = [
  {
    label: '',
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'userName',
    label: '用户名',
    component: 'Input',
    componentProps: {
      readOnly: true,
      allowClear: false,
    },
  },
  {
    field: 'agentUserName',
    label: '代理人用户名',
    required: true,
    component: 'JSelectUser',
    componentProps: {
      rowKey: 'username',
      labelKey: 'realname',
      maxSelectCount: 10,
    },
  },
  {
    field: 'startTime',
    label: '代理开始时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择代理开始时间',
    },
  },
  {
    field: 'endTime',
    label: '代理结束时间',
    component: 'DatePicker',
    required: true,
    componentProps: {
      showTime: true,
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      placeholder: '请选择代理结束时间',
    },
  },
  {
    field: 'status',
    label: '状态',
    component: 'JDictSelectTag',
    defaultValue: '1',
    componentProps: {
      dictCode: 'valid_status',
      type: 'radioButton',
    },
  },
];

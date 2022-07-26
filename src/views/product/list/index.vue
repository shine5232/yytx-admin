<template>
  <div>
    <!--引用表格-->
    <BasicTable @register="registerTable" :rowSelection="rowSelection">
      <!--插槽:table标题-->
      <template #tableTitle>
        <a-button type="primary" preIcon="ant-design:plus-outlined" @click="handleCreate"> 新增</a-button>
        <a-dropdown v-if="selectedRowKeys.length > 0">
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" @click="batchHandleDelete">
                <Icon icon="ant-design:delete-outlined"></Icon>
                删除
              </a-menu-item>
              <a-menu-item key="2" @click="batchFrozen(2)">
                <Icon icon="ant-design:lock-outlined"></Icon>
                冻结
              </a-menu-item>
              <a-menu-item key="3" @click="batchFrozen(1)">
                <Icon icon="ant-design:unlock-outlined"></Icon>
                解冻
              </a-menu-item>
            </a-menu>
          </template>
          <a-button
            >批量操作
            <Icon icon="mdi:chevron-down"></Icon>
          </a-button>
        </a-dropdown>
      </template>
      <!--操作栏-->
      <template #action="{ record }">
        <TableAction :actions="getTableAction(record)" :dropDownActions="getDropDownAction(record)" />
      </template>
    </BasicTable>
    <!--用户抽屉-->
    <UserDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts" name="system-user" setup>
  //ts语法
  import { ref, computed, unref } from 'vue';
  import { BasicTable, TableAction, ActionItem } from '/@/components/Table';
  import UserDrawer from './UserDrawer.vue';
  import JThirdAppButton from '/@/components/jeecg/thirdApp/JThirdAppButton.vue';
  import { useDrawer } from '/@/components/Drawer';
  import { useListPage } from '/@/hooks/system/useListPage';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, searchFormSchema } from './product.data';
  import { list, deleteUser, batchDeleteUser, getImportUrl, getExportUrl, frozenBatch, syncUser } from './product.api';
  // import { usePermission } from '/@/hooks/web/usePermission'
  // const { hasPermission } = usePermission();

  const { createMessage, createConfirm } = useMessage();

  const selectRows = ref([]);
  //注册drawer
  const [registerDrawer, { openDrawer }] = useDrawer();

  // 列表页面公共参数、方法
  const { prefixCls, tableContext, onExportXls, onImportXls } = useListPage({
    designScope: 'user-list',
    tableProps: {
      title: '用户列表',
      api: list,
      columns: columns,
      size: 'small',
      formConfig: {
        labelWidth: 200,
        schemas: searchFormSchema,
      },
      useSearchForm:false,
      actionColumn: {
        width: 120,
      },
      beforeFetch: (params) => {
        return Object.assign({ column: 'createTime', order: 'desc' }, params);
      },
    },
  });

  //注册table数据
  const [registerTable, { reload, updateTableDataRecord }, { rowSelection, selectedRowKeys }] = tableContext;

  /**
   * 新增事件
   */
  function handleCreate() {
    openDrawer(true, {
      isUpdate: false,
      showFooter: true,
    });
  }
  /**
   * 编辑事件
   */
  async function handleEdit(record: Recordable) {
    openDrawer(true, {
      record,
      isUpdate: true,
      showFooter: true,
    });
  }
  /**
   * 删除事件
   */
  async function handleDelete(record) {
    if ('admin' == record.username) {
      createMessage.warning('管理员账号不允许此操作！');
      return;
    }
    await deleteUser({ id: record.id }, reload);
  }
  /**
   * 成功回调
   */
  function handleSuccess() {
    reload();
  }

  /**
   * 冻结解冻
   */
  async function handleFrozen(record, status) {
    if ('admin' == record.username) {
      createMessage.warning('管理员账号不允许此操作！');
      return;
    }
    await frozenBatch({ ids: record.id, status: status }, reload);
  }
  /**
   * 批量冻结解冻
   */
  function batchFrozen(status) {
    let hasAdmin = unref(selectRows).filter((item) => item.username == 'admin');
    if (unref(hasAdmin).length > 0) {
      createMessage.warning('管理员账号不允许此操作！');
      return;
    }
    createConfirm({
      iconType: 'warning',
      title: '确认操作',
      content: '是否' + (status == 1 ? '解冻' : '冻结') + '选中账号?',
      onOk: async () => {
        await frozenBatch({ ids: unref(selectedRowKeys).join(','), status: status }, reload);
      },
    });
  }

  /**
   *同步流程
   */
  function handleSyncUser() {
    syncUser();
  }
  /**
   *同步钉钉和微信回调
   */
  function onSyncFinally({ isToLocal }) {
    // 同步到本地时刷新下数据
    if (isToLocal) {
      reload();
    }
  }

  /**
   * 操作栏
   */
  function getTableAction(record): ActionItem[] {
    return [
      {
        label: '编辑',
        onClick: handleEdit.bind(null, record),
        // ifShow: () => hasPermission('system:user:edit'),
      },
      {
        label: '删除',
        popConfirm: {
          title: '是否确认删除',
          confirm: handleDelete.bind(null, record),
        }
      }
    ];
  }
  /**
   * 下拉操作栏
   */
  function getDropDownAction(record): ActionItem[] {
    return [
      {
        label: '禁用',
        ifShow: record.status == 1,
        popConfirm: {
          title: '确定禁用吗?',
          confirm: handleFrozen.bind(null, record, 2),
        },
      },
      {
        label: '启用',
        ifShow: record.status == 2,
        popConfirm: {
          title: '确定启用吗?',
          confirm: handleFrozen.bind(null, record, 1),
        },
      },
      {
        label: '查看设备',
        onClick: handleEdit.bind(null, record),
      },
      {
        label: '添加批次',
        onClick: handleEdit.bind(null, record),
      },
    ];
  }
</script>

<style scoped></style>

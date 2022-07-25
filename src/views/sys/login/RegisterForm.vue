<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="account" class="enter-x">
        <Input class="fix-auto-fill inputs" allowClear v-model:value="formData.account"
          :placeholder="t('sys.login.userName')">
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
        </Input>
      </FormItem>
      <FormItem name="password" class="enter-x">
        <StrengthMeter class="inputs" allowClear v-model:value="formData.password" :placeholder="t('sys.login.password')">
          <template #prefix>
            <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </StrengthMeter>
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword class="inputs"  visibilityToggle allowClear v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')">
          <template #prefix>
            <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </InputPassword>
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input v-model:value="formData.mobile" allowClear :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill inputs" />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput  class="fix-auto-fill" v-model:value="formData.sms"
          :placeholder="t('sys.login.smsCode')" :sendCodeApi="sendCodeApi" />
      </FormItem>
      <ARow class="enter-x" :gutter="16">
        <ACol :span="12">
          <FormItem name="company">
            <Input v-model:value="formData.company" allowClear :placeholder="t('sys.login.companyPlaceholder')"
              class="fix-auto-fill inputs"/>
          </FormItem>
        </ACol>
        <ACol :span="12">
          <FormItem name="contacter">
            <Input v-model:value="formData.contacter" allowClear :placeholder="t('sys.login.contacterPlaceholder')"
              class="fix-auto-fill inputs" />
          </FormItem>
        </ACol>
        <ACol :span="12">
          <FormItem name="wechat">
            <Input v-model:value="formData.wechat" allowClear :placeholder="t('sys.login.wechatPlaceholder')"
              class="fix-auto-fill inputs" />
          </FormItem>
        </ACol>
        <ACol :span="12">
          <FormItem name="email">
            <Input v-model:value="formData.email" allowClear :placeholder="t('sys.login.emailPlaceholder')"
              class="fix-auto-fill inputs" />
          </FormItem>
        </ACol>
        <ACol :span="12">
          <FormItem name="userType">
            <RadioGroup v-model:value="formData.userType">
              <Radio :value="1">客户</Radio>
              <Radio :value="2">方案商</Radio>
            </RadioGroup>
          </FormItem>
        </ACol>
      </ARow>
      <FormItem class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
        <span class="span url"><a href="">宇音天下软件授权服务协议</a></span>
        <span class="span"> 与 </span>
        <span class="span url"><a href="">隐私政策</a></span>
      </FormItem>

      <Button type="primary" class="enter-x"  block @click="handleRegister" :loading="loading">
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button  block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
  import {
    reactive,
    ref,
    unref,
    computed,
    toRaw
  } from 'vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import {
    Form,
    Input,
    Button,
    Checkbox,
    RadioGroup,
    Radio
  } from 'ant-design-vue';
  import {
    StrengthMeter
  } from '/@/components/StrengthMeter';
  import {
    CountdownInput
  } from '/@/components/CountDown';
  import {
    useI18n
  } from '/@/hooks/web/useI18n';
  import {
    useMessage
  } from '/@/hooks/web/useMessage';
  import {
    useLoginState,
    useFormRules,
    useFormValid,
    LoginStateEnum,
    SmsEnum
  } from './useLogin';
  import {
    register,
    getCaptcha
  } from '/@/api/sys/user';

  import {
    UserOutlined,
    LockOutlined,
    SmileOutlined
  } from '@ant-design/icons-vue';
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const {
    t
  } = useI18n();
  const {
    handleBackLogin,
    getLoginState
  } = useLoginState();
  const {
    notification,
    createErrorModal
  } = useMessage();
  const formRef = ref();
  const loading = ref(false);
  const formData = reactive({
    account: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    sms: '',
    policy: false,
    company:'',
    contacter:'',
    wechat:'',
    email:'',
    userType:1,
  });
  const {
    getFormRules
  } = useFormRules(formData);
  const {
    validForm
  } = useFormValid(formRef);
  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);
  /**
   * 注册
   */
  async function handleRegister() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const resultInfo = await register(
        toRaw({
          username: data.account,
          password: data.password,
          phone: data.mobile,
          smscode: data.sms,
        })
      );
      if (resultInfo && resultInfo.data.success) {
        notification.success({
          description: resultInfo.data.message || t('sys.api.registerMsg'),
          duration: 3,
        });
        handleBackLogin();
      } else {
        notification.warning({
          message: t('sys.api.errorTip'),
          description: resultInfo.data.message || t('sys.api.networkExceptionMsg'),
          duration: 3,
        });
      }
    } catch (error) {
      notification.error({
        message: t('sys.api.errorTip'),
        description: error.message || t('sys.api.networkExceptionMsg'),
        duration: 3,
      });
    } finally {
      loading.value = false;
    }
  }
  //发送验证码的函数
  function sendCodeApi() {
    return getCaptcha({
      mobile: formData.mobile,
      smsmode: SmsEnum.REGISTER
    });
  }
</script>
<style>
  /* .inputs{
    min-width: initial !important;
    width: 100%;
  } */
  .jeecg-login input:not([type='checkbox']){
    min-width: initial !important;
    width: 100%;
  }
</style>

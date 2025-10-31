<script setup lang="ts">
const { formInst, formValue, SafeNForm, SafeNFormItem } = useSafeNForm({
  initialFormValue: {
    /* ⚠️:
      如果没使用`SafeNFormItem`，
      这里`user`对象没有手动初始化的话，将会报错：
      `can't access property "name", $setup.formValue.user is undefined`
    */
    user: {
      name: '',
      age: 0,
    },
    phone: '',
  },
});

function handleValidateClick() {
  formInst.value?.validate((errors) => {
    if (!errors) {
      window.$nMessage!.success('Valid');
    } else {
      console.log(errors);
      window.$nMessage!.error('Invalid');
    }
  });
}
</script>

<template>
  <div border>
    <pre>formValue: {{ JSON.stringify(formValue, null, 2) }}</pre>
  </div>

  <SafeNForm inline label-placement="left" label-width="auto" mt-4>
    <n-form-item
      label="姓名"
      path="user.name"
      :rule="{ required: true, message: '请输入姓名', trigger: ['input'] }"
    >
      <n-input v-model:value="formValue.user.name" placeholder="输入姓名" />
    </n-form-item>

    <SafeNFormItem
      #default="{ value, setValue }"
      :rule="{ required: true, message: '请输入姓名', trigger: ['input'] }"
      label="姓名"
      path="user.name"
    >
      <NInput :value="value" placeholder="SafeNFormItem" @update:value="setValue" />
    </SafeNFormItem>

    <n-form-item
      label="电话号码"
      path="phone"
      :rule="{ required: true, message: '请输入电话号码', trigger: ['blur'] }"
    >
      <n-input v-model:value="formValue.phone" placeholder="电话号码" />
    </n-form-item>

    <SafeNFormItem
      label="电话号码"
      path="phone"
      :rule="{ required: true, message: '请输入电话号码', trigger: ['blur'] }"
    >
      <!-- 如果没有提供插槽，会默认渲染一个`<NInput>` -->
    </SafeNFormItem>

    <n-form-item>
      <n-button attr-type="button" @click="handleValidateClick"> 验证 </n-button>
    </n-form-item>
  </SafeNForm>
</template>

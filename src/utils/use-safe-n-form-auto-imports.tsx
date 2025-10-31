/**
 * https://www.naiveui.com/zh-CN/os-theme/components/form
 *
 * FIXME: `NForm` 和 `NFormItem` 的 slots 还没有实现。`NFormItemGi`组件。
 */

import { get, set } from 'lodash-es';
import type { FormInst, FormItemProps, FormProps } from 'naive-ui';
import { NForm, NFormItem, formItemProps, NInput, formProps } from 'naive-ui';
import type { Get, Paths } from 'type-fest';
import type { SlotsType } from 'vue';
import { Comment } from 'vue';

type UseSafeNFormOptions<FormValue> = {
  initialFormValue?: FormValue;
};

export function useSafeNForm<T extends Record<string, any> = Record<string, unknown>>(
  options: UseSafeNFormOptions<T> = {},
) {
  const formRef = ref<FormInst | null>(null);
  const formValue = ref<T>(structuredClone(toRaw(options.initialFormValue)) || ({} as T));

  // 创建类型安全的 Form 组件
  type SafeNFormProps = FormProps;

  type SafeNFormSlots = SlotsType<{
    default?: { count?: number };
  }>;

  const SafeNForm = defineComponent<SafeNFormProps, /* Emits */ [], /* EE */ never, SafeNFormSlots>(
    (props, ctx) => {
      return () => (
        <NForm
          {...props}
          model={formValue.value}
          ref={(inst) => {
            formRef.value = inst as unknown as FormInst;
          }}
        >
          {ctx.slots.default?.({})}
        </NForm>
      );
    },
    {
      name: 'SafeNForm',
      inheritAttrs: true,
      props: formProps,
    },
  );
  // <<<<<

  // >>>>> 创建类型安全的 FormItem 组件
  type SafeNFormItemProps<P extends Paths<T> & string> = FormItemProps & {
    path: P;
  };

  type SafeNFormItemDefaultSlot<P extends Paths<T> & string> = {
    value: Get<T, P>;
    setValue: (val: Get<T, P>) => void;
  };

  const SafeNFormItemImpl = defineComponent<
    SafeNFormItemProps<Paths<T> & string>,
    /* Emits */ [],
    /* EE */ never,
    SlotsType<{ default: SafeNFormItemDefaultSlot<Paths<T> & string> }>
  >(
    (props, ctx) => {
      return () => {
        const value = get(formValue.value, props.path);
        function setValue(val: typeof value) {
          set(formValue.value, props.path, val);
        }

        const defaultSlotContent = ctx.slots.default?.({
          value,
          setValue,
        });

        // 如果没有提供默认 slot 内容，则渲染一个 NInput 作为默认输入组件
        const renderDefaultNInput = defaultSlotContent?.some((v) => v.type !== Comment) ? null : (
          <NInput value={value} onUpdate:value={setValue} />
        );

        return (
          <NFormItem {...props} path={props.path}>
            {defaultSlotContent}
            {renderDefaultNInput}
          </NFormItem>
        );
      };
    },
    {
      name: 'SafeNFormItem',
      inheritAttrs: false,
      props: Object.keys(formItemProps) as unknown as [keyof FormItemProps],
    },
  );

  // Expose a generic constructor so template literals narrow `path`.
  type SafeNFormItemComponent = {
    new <P extends Paths<T> & string>(
      props: SafeNFormItemProps<P>,
    ): {
      $props: SafeNFormItemProps<P>;
      $slots: {
        default?: (scope: SafeNFormItemDefaultSlot<P>) => VNode[];
      };
    };
  };
  const SafeNFormItem = SafeNFormItemImpl as SafeNFormItemComponent;
  // <<<<<

  return {
    formValue,
    SafeNForm,
    SafeNFormItem,
    formRef,
  };
}

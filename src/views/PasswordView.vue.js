import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
const router = useRouter();
const password = ref('');
const loading = ref(false);
const error = ref('');
const handleLogin = async () => {
    if (!password.value.trim()) {
        error.value = '请输入密码';
        return;
    }
    loading.value = true;
    error.value = '';
    try {
        // 获取环境变量中的密码
        const correctPassword = import.meta.env.VITE_ACCESS_PASSWORD || 'admin123';
        // 模拟异步验证
        await new Promise(resolve => setTimeout(resolve, 500));
        if (password.value === correctPassword) {
            // 设置认证状态
            localStorage.setItem('authenticated', 'true');
            message.success('密码正确，正在跳转...');
            // 延迟跳转，让用户看到成功消息
            setTimeout(() => {
                router.push('/home');
            }, 800);
        }
        else {
            error.value = '密码错误，请重试';
            message.error('密码错误');
            password.value = ''; // 清空密码输入框
        }
    }
    catch {
        error.value = '验证失败，请稍后重试';
        message.error('验证失败');
    }
    finally {
        loading.value = false;
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-input']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-input-password']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['password-container']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-card-head-title']} */ ;
/** @type {__VLS_StyleScopedClasses['card-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "password-container" },
});
/** @type {__VLS_StyleScopedClasses['password-container']} */ ;
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.aLayout | typeof __VLS_components.ALayout | typeof __VLS_components.aLayout | typeof __VLS_components.ALayout} */
aLayout;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "layout" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "layout" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type {typeof __VLS_components.aLayoutContent | typeof __VLS_components.ALayoutContent | typeof __VLS_components.aLayoutContent | typeof __VLS_components.ALayoutContent} */
aLayoutContent;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ class: "content" },
}));
const __VLS_8 = __VLS_7({
    ...{ class: "content" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['content']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "password-card" },
});
/** @type {__VLS_StyleScopedClasses['password-card']} */ ;
let __VLS_12;
/** @ts-ignore @type {typeof __VLS_components.aCard | typeof __VLS_components.ACard | typeof __VLS_components.aCard | typeof __VLS_components.ACard} */
aCard;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    title: "访问验证",
    bordered: true,
}));
const __VLS_14 = __VLS_13({
    title: "访问验证",
    bordered: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-content" },
});
/** @type {__VLS_StyleScopedClasses['card-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "description" },
});
/** @type {__VLS_StyleScopedClasses['description']} */ ;
let __VLS_18;
/** @ts-ignore @type {typeof __VLS_components.aForm | typeof __VLS_components.AForm | typeof __VLS_components.aForm | typeof __VLS_components.AForm} */
aForm;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ...{ 'onSubmit': {} },
    layout: "vertical",
}));
const __VLS_20 = __VLS_19({
    ...{ 'onSubmit': {} },
    layout: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
let __VLS_23;
const __VLS_24 = ({ submit: {} },
    { onSubmit: (__VLS_ctx.handleLogin) });
const { default: __VLS_25 } = __VLS_21.slots;
let __VLS_26;
/** @ts-ignore @type {typeof __VLS_components.aFormItem | typeof __VLS_components.AFormItem | typeof __VLS_components.aFormItem | typeof __VLS_components.AFormItem} */
aFormItem;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    label: "密码",
}));
const __VLS_28 = __VLS_27({
    label: "密码",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
let __VLS_32;
/** @ts-ignore @type {typeof __VLS_components.aInputPassword | typeof __VLS_components.AInputPassword} */
aInputPassword;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    ...{ 'onPressEnter': {} },
    value: (__VLS_ctx.password),
    placeholder: "请输入访问密码",
    size: "large",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_34 = __VLS_33({
    ...{ 'onPressEnter': {} },
    value: (__VLS_ctx.password),
    placeholder: "请输入访问密码",
    size: "large",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
const __VLS_38 = ({ pressEnter: {} },
    { onPressEnter: (__VLS_ctx.handleLogin) });
var __VLS_35;
var __VLS_36;
// @ts-ignore
[handleLogin, handleLogin, password, loading,];
var __VLS_29;
let __VLS_39;
/** @ts-ignore @type {typeof __VLS_components.aFormItem | typeof __VLS_components.AFormItem | typeof __VLS_components.aFormItem | typeof __VLS_components.AFormItem} */
aFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type {typeof __VLS_components.aButton | typeof __VLS_components.AButton | typeof __VLS_components.aButton | typeof __VLS_components.AButton} */
aButton;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    ...{ 'onClick': {} },
    type: "primary",
    htmlType: "submit",
    size: "large",
    loading: (__VLS_ctx.loading),
    disabled: (!__VLS_ctx.password || __VLS_ctx.loading),
    block: true,
}));
const __VLS_47 = __VLS_46({
    ...{ 'onClick': {} },
    type: "primary",
    htmlType: "submit",
    size: "large",
    loading: (__VLS_ctx.loading),
    disabled: (!__VLS_ctx.password || __VLS_ctx.loading),
    block: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
let __VLS_50;
const __VLS_51 = ({ click: {} },
    { onClick: (__VLS_ctx.handleLogin) });
const { default: __VLS_52 } = __VLS_48.slots;
(__VLS_ctx.loading ? '验证中...' : '访问网站');
// @ts-ignore
[handleLogin, password, loading, loading, loading,];
var __VLS_48;
var __VLS_49;
// @ts-ignore
[];
var __VLS_42;
// @ts-ignore
[];
var __VLS_21;
var __VLS_22;
if (__VLS_ctx.error) {
    let __VLS_53;
    /** @ts-ignore @type {typeof __VLS_components.aAlert | typeof __VLS_components.AAlert} */
    aAlert;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        message: (__VLS_ctx.error),
        type: "error",
        showIcon: true,
        ...{ class: "error-alert" },
    }));
    const __VLS_55 = __VLS_54({
        message: (__VLS_ctx.error),
        type: "error",
        showIcon: true,
        ...{ class: "error-alert" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    /** @type {__VLS_StyleScopedClasses['error-alert']} */ ;
}
// @ts-ignore
[error, error,];
var __VLS_15;
// @ts-ignore
[];
var __VLS_9;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};

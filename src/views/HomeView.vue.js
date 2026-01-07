import { ref, computed } from 'vue';
import { message } from 'ant-design-vue';
const keyword = ref('');
const loading = ref(false);
const magnetsLoading = ref(false);
const error = ref('');
const movieData = ref(null);
const magnets = ref([]);
const showOnlyHD = ref(false);
const showOnlySubtitle = ref(false);
const sortBy = ref('size');
// 搜索电影
const search = async () => {
    if (!keyword.value.trim())
        return;
    loading.value = true;
    error.value = '';
    movieData.value = null;
    magnets.value = [];
    try {
        const response = await fetch(`/api/movies/${keyword.value.trim()}`);
        if (!response.ok) {
            throw new Error('搜索失败，请检查编号是否正确');
        }
        const data = await response.json();
        movieData.value = data;
        message.success('搜索成功！');
    }
    catch (err) {
        error.value = err.message || '搜索出错，请稍后重试';
        message.error(err.message || '搜索出错，请稍后重试');
    }
    finally {
        loading.value = false;
    }
};
// 加载磁力链接
const loadMagnets = async () => {
    if (!movieData.value)
        return;
    magnetsLoading.value = true;
    error.value = '';
    try {
        const { gid, uc } = movieData.value;
        const response = await fetch(`/api/magnets/${movieData.value.id}?gid=${gid}&uc=${uc}&sortBy=${sortBy.value}&sortOrder=asc`);
        if (!response.ok) {
            throw new Error('加载磁力链接失败');
        }
        const data = await response.json();
        magnets.value = data;
        message.success(`成功加载 ${data.length} 个磁力链接`);
    }
    catch (err) {
        error.value = err.message || '加载磁力链接出错';
        message.error(err.message || '加载磁力链接出错');
    }
    finally {
        magnetsLoading.value = false;
    }
};
// 搜索相似视频
const searchSimilar = (id) => {
    keyword.value = id;
    search();
};
// 清空结果
const clearResults = () => {
    keyword.value = '';
    movieData.value = null;
    magnets.value = [];
    error.value = '';
};
// 处理排序变化
const handleSortChange = () => {
    if (magnets.value.length > 0 && movieData.value) {
        // 重新加载磁力链接以应用新的排序
        loadMagnets();
    }
};
// 过滤磁力链接
const filteredMagnets = computed(() => {
    let result = [...magnets.value];
    if (showOnlyHD.value) {
        result = result.filter(m => m.isHD);
    }
    if (showOnlySubtitle.value) {
        result = result.filter(m => m.hasSubtitle);
    }
    // 排序
    result.sort((a, b) => {
        if (sortBy.value === 'size') {
            return b.numberSize - a.numberSize;
        }
        else if (sortBy.value === 'date') {
            return new Date(b.date || 0) - new Date(a.date || 0);
        }
        else if (sortBy.value === 'shareDate') {
            return new Date(b.shareDate) - new Date(a.shareDate);
        }
        return 0;
    });
    return result;
});
// 格式化时长
const formatDuration = (minutes) => {
    if (!minutes)
        return '未知';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
};
// 获取类别文本
const getGenresText = (genres) => {
    if (!genres || genres.length === 0)
        return '未知';
    return genres.map(g => g.name).join('、');
};
// 获取演员文本
const getStarsText = (stars) => {
    if (!stars || stars.length === 0)
        return '未知';
    return stars.map(s => s.name).join('、');
};
// 渲染磁力链接标题
const renderMagnetTitle = (magnet) => {
    const badges = [];
    if (magnet.isHD)
        badges.push('[HD]');
    if (magnet.hasSubtitle)
        badges.push('[字幕]');
    return `${badges.join(' ')} ${magnet.title}`;
};
// 复制磁力链接
const copyMagnet = async (magnet) => {
    try {
        await navigator.clipboard.writeText(magnet.link);
        message.success('磁力链接已复制到剪贴板！');
    }
    catch (err) {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = magnet.link;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        message.success('磁力链接已复制到剪贴板！');
    }
};
// 下载磁力链接
const downloadMagnet = (magnet) => {
    // 创建下载链接
    const link = document.createElement('a');
    link.href = magnet.link;
    link.download = `${magnet.title}.magnet`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 尝试直接打开磁力链接
    window.location.href = magnet.link;
    message.info('正在尝试打开磁力链接...');
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['movie-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['movie-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['movie-details']} */ ;
/** @type {__VLS_StyleScopedClasses['similar-item']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-image-img']} */ ;
/** @type {__VLS_StyleScopedClasses['magnet-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['magnet-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['movie-content']} */ ;
/** @type {__VLS_StyleScopedClasses['movie-cover']} */ ;
/** @type {__VLS_StyleScopedClasses['ant-image-img']} */ ;
/** @type {__VLS_StyleScopedClasses['similar-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['magnet-filters']} */ ;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['similar-grid']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "home-container" },
});
/** @type {__VLS_StyleScopedClasses['home-container']} */ ;
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
/** @ts-ignore @type {typeof __VLS_components.aLayoutHeader | typeof __VLS_components.ALayoutHeader | typeof __VLS_components.aLayoutHeader | typeof __VLS_components.ALayoutHeader} */
aLayoutHeader;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ class: "header" },
}));
const __VLS_8 = __VLS_7({
    ...{ class: "header" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['header']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({
    ...{ class: "title" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type {typeof __VLS_components.aLayoutContent | typeof __VLS_components.ALayoutContent | typeof __VLS_components.aLayoutContent | typeof __VLS_components.ALayoutContent} */
aLayoutContent;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ class: "content" },
}));
const __VLS_14 = __VLS_13({
    ...{ class: "content" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
/** @type {__VLS_StyleScopedClasses['content']} */ ;
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "main-wrapper" },
});
/** @type {__VLS_StyleScopedClasses['main-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "search-section" },
});
/** @type {__VLS_StyleScopedClasses['search-section']} */ ;
let __VLS_18;
/** @ts-ignore @type {typeof __VLS_components.aCard | typeof __VLS_components.ACard | typeof __VLS_components.aCard | typeof __VLS_components.ACard} */
aCard;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    title: "搜索视频",
    ...{ class: "search-card" },
}));
const __VLS_20 = __VLS_19({
    title: "搜索视频",
    ...{ class: "search-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['search-card']} */ ;
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type {typeof __VLS_components.aForm | typeof __VLS_components.AForm | typeof __VLS_components.aForm | typeof __VLS_components.AForm} */
aForm;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    layout: "vertical",
}));
const __VLS_26 = __VLS_25({
    layout: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
let __VLS_30;
/** @ts-ignore @type {typeof __VLS_components.aFormItem | typeof __VLS_components.AFormItem | typeof __VLS_components.aFormItem | typeof __VLS_components.AFormItem} */
aFormItem;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    label: "视频编号",
}));
const __VLS_32 = __VLS_31({
    label: "视频编号",
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
const { default: __VLS_35 } = __VLS_33.slots;
let __VLS_36;
/** @ts-ignore @type {typeof __VLS_components.aInput | typeof __VLS_components.AInput} */
aInput;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    ...{ 'onPressEnter': {} },
    value: (__VLS_ctx.keyword),
    placeholder: "输入视频编号，例如：PPBD-145",
    size: "large",
    disabled: (__VLS_ctx.loading),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onPressEnter': {} },
    value: (__VLS_ctx.keyword),
    placeholder: "输入视频编号，例如：PPBD-145",
    size: "large",
    disabled: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_41;
const __VLS_42 = ({ pressEnter: {} },
    { onPressEnter: (__VLS_ctx.search) });
var __VLS_39;
var __VLS_40;
// @ts-ignore
[keyword, loading, search,];
var __VLS_33;
let __VLS_43;
/** @ts-ignore @type {typeof __VLS_components.aFormItem | typeof __VLS_components.AFormItem | typeof __VLS_components.aFormItem | typeof __VLS_components.AFormItem} */
aFormItem;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({}));
const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
let __VLS_49;
/** @ts-ignore @type {typeof __VLS_components.aSpace | typeof __VLS_components.ASpace | typeof __VLS_components.aSpace | typeof __VLS_components.ASpace} */
aSpace;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
const { default: __VLS_54 } = __VLS_52.slots;
let __VLS_55;
/** @ts-ignore @type {typeof __VLS_components.aButton | typeof __VLS_components.AButton | typeof __VLS_components.aButton | typeof __VLS_components.AButton} */
aButton;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.loading),
    disabled: (!__VLS_ctx.keyword || __VLS_ctx.loading),
}));
const __VLS_57 = __VLS_56({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    loading: (__VLS_ctx.loading),
    disabled: (!__VLS_ctx.keyword || __VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_60;
const __VLS_61 = ({ click: {} },
    { onClick: (__VLS_ctx.search) });
const { default: __VLS_62 } = __VLS_58.slots;
(__VLS_ctx.loading ? '搜索中...' : '搜索');
// @ts-ignore
[keyword, loading, loading, loading, search,];
var __VLS_58;
var __VLS_59;
if (__VLS_ctx.movieData || __VLS_ctx.magnets.length > 0) {
    let __VLS_63;
    /** @ts-ignore @type {typeof __VLS_components.aButton | typeof __VLS_components.AButton | typeof __VLS_components.aButton | typeof __VLS_components.AButton} */
    aButton;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ 'onClick': {} },
        size: "large",
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onClick': {} },
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    const __VLS_69 = ({ click: {} },
        { onClick: (__VLS_ctx.clearResults) });
    const { default: __VLS_70 } = __VLS_66.slots;
    // @ts-ignore
    [movieData, magnets, clearResults,];
    var __VLS_66;
    var __VLS_67;
}
// @ts-ignore
[];
var __VLS_52;
// @ts-ignore
[];
var __VLS_46;
// @ts-ignore
[];
var __VLS_27;
// @ts-ignore
[];
var __VLS_21;
if (__VLS_ctx.error) {
    let __VLS_71;
    /** @ts-ignore @type {typeof __VLS_components.aAlert | typeof __VLS_components.AAlert} */
    aAlert;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        message: (__VLS_ctx.error),
        type: "error",
        showIcon: true,
        ...{ class: "error-alert" },
    }));
    const __VLS_73 = __VLS_72({
        message: (__VLS_ctx.error),
        type: "error",
        showIcon: true,
        ...{ class: "error-alert" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    /** @type {__VLS_StyleScopedClasses['error-alert']} */ ;
}
if (__VLS_ctx.movieData) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "results-section" },
    });
    /** @type {__VLS_StyleScopedClasses['results-section']} */ ;
    let __VLS_76;
    /** @ts-ignore @type {typeof __VLS_components.aCard | typeof __VLS_components.ACard | typeof __VLS_components.aCard | typeof __VLS_components.ACard} */
    aCard;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        title: "视频信息",
        ...{ class: "result-card" },
    }));
    const __VLS_78 = __VLS_77({
        title: "视频信息",
        ...{ class: "result-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    /** @type {__VLS_StyleScopedClasses['result-card']} */ ;
    const { default: __VLS_81 } = __VLS_79.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "movie-content" },
    });
    /** @type {__VLS_StyleScopedClasses['movie-content']} */ ;
    if (__VLS_ctx.movieData.img) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "movie-cover" },
        });
        /** @type {__VLS_StyleScopedClasses['movie-cover']} */ ;
        let __VLS_82;
        /** @ts-ignore @type {typeof __VLS_components.aImage | typeof __VLS_components.AImage} */
        aImage;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
            src: (__VLS_ctx.movieData.img),
            alt: (__VLS_ctx.movieData.title),
        }));
        const __VLS_84 = __VLS_83({
            src: (__VLS_ctx.movieData.img),
            alt: (__VLS_ctx.movieData.title),
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "movie-details" },
    });
    /** @type {__VLS_StyleScopedClasses['movie-details']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
    (__VLS_ctx.movieData.title);
    let __VLS_87;
    /** @ts-ignore @type {typeof __VLS_components.aDescriptions | typeof __VLS_components.ADescriptions | typeof __VLS_components.aDescriptions | typeof __VLS_components.ADescriptions} */
    aDescriptions;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        column: (2),
        size: "small",
        bordered: true,
    }));
    const __VLS_89 = __VLS_88({
        column: (2),
        size: "small",
        bordered: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    const { default: __VLS_92 } = __VLS_90.slots;
    let __VLS_93;
    /** @ts-ignore @type {typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem | typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem} */
    aDescriptionsItem;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        label: "编号",
    }));
    const __VLS_95 = __VLS_94({
        label: "编号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    const { default: __VLS_98 } = __VLS_96.slots;
    (__VLS_ctx.movieData.id);
    // @ts-ignore
    [movieData, movieData, movieData, movieData, movieData, movieData, error, error,];
    var __VLS_96;
    let __VLS_99;
    /** @ts-ignore @type {typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem | typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem} */
    aDescriptionsItem;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
        label: "日期",
    }));
    const __VLS_101 = __VLS_100({
        label: "日期",
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    const { default: __VLS_104 } = __VLS_102.slots;
    (__VLS_ctx.movieData.date);
    // @ts-ignore
    [movieData,];
    var __VLS_102;
    let __VLS_105;
    /** @ts-ignore @type {typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem | typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem} */
    aDescriptionsItem;
    // @ts-ignore
    const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
        label: "时长",
    }));
    const __VLS_107 = __VLS_106({
        label: "时长",
    }, ...__VLS_functionalComponentArgsRest(__VLS_106));
    const { default: __VLS_110 } = __VLS_108.slots;
    (__VLS_ctx.formatDuration(__VLS_ctx.movieData.videoLength));
    // @ts-ignore
    [movieData, formatDuration,];
    var __VLS_108;
    if (__VLS_ctx.movieData.director) {
        let __VLS_111;
        /** @ts-ignore @type {typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem | typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem} */
        aDescriptionsItem;
        // @ts-ignore
        const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
            label: "导演",
        }));
        const __VLS_113 = __VLS_112({
            label: "导演",
        }, ...__VLS_functionalComponentArgsRest(__VLS_112));
        const { default: __VLS_116 } = __VLS_114.slots;
        (__VLS_ctx.movieData.director.name);
        // @ts-ignore
        [movieData, movieData,];
        var __VLS_114;
    }
    if (__VLS_ctx.movieData.producer) {
        let __VLS_117;
        /** @ts-ignore @type {typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem | typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem} */
        aDescriptionsItem;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
            label: "制作商",
        }));
        const __VLS_119 = __VLS_118({
            label: "制作商",
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        const { default: __VLS_122 } = __VLS_120.slots;
        (__VLS_ctx.movieData.producer.name);
        // @ts-ignore
        [movieData, movieData,];
        var __VLS_120;
    }
    if (__VLS_ctx.movieData.publisher) {
        let __VLS_123;
        /** @ts-ignore @type {typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem | typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem} */
        aDescriptionsItem;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
            label: "发行商",
        }));
        const __VLS_125 = __VLS_124({
            label: "发行商",
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        const { default: __VLS_128 } = __VLS_126.slots;
        (__VLS_ctx.movieData.publisher.name);
        // @ts-ignore
        [movieData, movieData,];
        var __VLS_126;
    }
    if (__VLS_ctx.movieData.series) {
        let __VLS_129;
        /** @ts-ignore @type {typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem | typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem} */
        aDescriptionsItem;
        // @ts-ignore
        const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
            label: "系列",
        }));
        const __VLS_131 = __VLS_130({
            label: "系列",
        }, ...__VLS_functionalComponentArgsRest(__VLS_130));
        const { default: __VLS_134 } = __VLS_132.slots;
        (__VLS_ctx.movieData.series.name);
        // @ts-ignore
        [movieData, movieData,];
        var __VLS_132;
    }
    let __VLS_135;
    /** @ts-ignore @type {typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem | typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem} */
    aDescriptionsItem;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
        label: "类别",
        span: (2),
    }));
    const __VLS_137 = __VLS_136({
        label: "类别",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    const { default: __VLS_140 } = __VLS_138.slots;
    (__VLS_ctx.getGenresText(__VLS_ctx.movieData.genres));
    // @ts-ignore
    [movieData, getGenresText,];
    var __VLS_138;
    let __VLS_141;
    /** @ts-ignore @type {typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem | typeof __VLS_components.aDescriptionsItem | typeof __VLS_components.ADescriptionsItem} */
    aDescriptionsItem;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        label: "演员",
        span: (2),
    }));
    const __VLS_143 = __VLS_142({
        label: "演员",
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    const { default: __VLS_146 } = __VLS_144.slots;
    (__VLS_ctx.getStarsText(__VLS_ctx.movieData.stars));
    // @ts-ignore
    [movieData, getStarsText,];
    var __VLS_144;
    // @ts-ignore
    [];
    var __VLS_90;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "action-buttons" },
    });
    /** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
    let __VLS_147;
    /** @ts-ignore @type {typeof __VLS_components.aButton | typeof __VLS_components.AButton | typeof __VLS_components.aButton | typeof __VLS_components.AButton} */
    aButton;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
        ...{ 'onClick': {} },
        type: "primary",
        size: "large",
        loading: (__VLS_ctx.magnetsLoading),
    }));
    const __VLS_149 = __VLS_148({
        ...{ 'onClick': {} },
        type: "primary",
        size: "large",
        loading: (__VLS_ctx.magnetsLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    let __VLS_152;
    const __VLS_153 = ({ click: {} },
        { onClick: (__VLS_ctx.loadMagnets) });
    const { default: __VLS_154 } = __VLS_150.slots;
    (__VLS_ctx.magnetsLoading ? '加载中...' : '下载磁力链接');
    // @ts-ignore
    [magnetsLoading, magnetsLoading, loadMagnets,];
    var __VLS_150;
    var __VLS_151;
    // @ts-ignore
    [];
    var __VLS_79;
    if (__VLS_ctx.movieData.similarMovies && __VLS_ctx.movieData.similarMovies.length > 0) {
        let __VLS_155;
        /** @ts-ignore @type {typeof __VLS_components.aCard | typeof __VLS_components.ACard | typeof __VLS_components.aCard | typeof __VLS_components.ACard} */
        aCard;
        // @ts-ignore
        const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
            title: "相似视频",
            ...{ class: "result-card" },
        }));
        const __VLS_157 = __VLS_156({
            title: "相似视频",
            ...{ class: "result-card" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_156));
        /** @type {__VLS_StyleScopedClasses['result-card']} */ ;
        const { default: __VLS_160 } = __VLS_158.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "similar-grid" },
        });
        /** @type {__VLS_StyleScopedClasses['similar-grid']} */ ;
        for (const [similar] of __VLS_vFor((__VLS_ctx.movieData.similarMovies))) {
            let __VLS_161;
            /** @ts-ignore @type {typeof __VLS_components.aCard | typeof __VLS_components.ACard | typeof __VLS_components.aCard | typeof __VLS_components.ACard} */
            aCard;
            // @ts-ignore
            const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
                ...{ 'onClick': {} },
                key: (similar.id),
                ...{ class: "similar-item" },
                hoverable: true,
            }));
            const __VLS_163 = __VLS_162({
                ...{ 'onClick': {} },
                key: (similar.id),
                ...{ class: "similar-item" },
                hoverable: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_162));
            let __VLS_166;
            const __VLS_167 = ({ click: {} },
                { onClick: (...[$event]) => {
                        if (!(__VLS_ctx.movieData))
                            return;
                        if (!(__VLS_ctx.movieData.similarMovies && __VLS_ctx.movieData.similarMovies.length > 0))
                            return;
                        __VLS_ctx.searchSimilar(similar.id);
                        // @ts-ignore
                        [movieData, movieData, movieData, searchSimilar,];
                    } });
            /** @type {__VLS_StyleScopedClasses['similar-item']} */ ;
            const { default: __VLS_168 } = __VLS_164.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "similar-cover" },
            });
            /** @type {__VLS_StyleScopedClasses['similar-cover']} */ ;
            let __VLS_169;
            /** @ts-ignore @type {typeof __VLS_components.aImage | typeof __VLS_components.AImage} */
            aImage;
            // @ts-ignore
            const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
                src: (similar.img),
                alt: (similar.title),
            }));
            const __VLS_171 = __VLS_170({
                src: (similar.img),
                alt: (similar.title),
            }, ...__VLS_functionalComponentArgsRest(__VLS_170));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "similar-title" },
            });
            /** @type {__VLS_StyleScopedClasses['similar-title']} */ ;
            (similar.title);
            // @ts-ignore
            [];
            var __VLS_164;
            var __VLS_165;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_158;
    }
    if (__VLS_ctx.magnets.length > 0) {
        let __VLS_174;
        /** @ts-ignore @type {typeof __VLS_components.aCard | typeof __VLS_components.ACard | typeof __VLS_components.aCard | typeof __VLS_components.ACard} */
        aCard;
        // @ts-ignore
        const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
            title: (`磁力链接 (${__VLS_ctx.magnets.length})`),
            ...{ class: "result-card" },
        }));
        const __VLS_176 = __VLS_175({
            title: (`磁力链接 (${__VLS_ctx.magnets.length})`),
            ...{ class: "result-card" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_175));
        /** @type {__VLS_StyleScopedClasses['result-card']} */ ;
        const { default: __VLS_179 } = __VLS_177.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "magnet-filters" },
        });
        /** @type {__VLS_StyleScopedClasses['magnet-filters']} */ ;
        let __VLS_180;
        /** @ts-ignore @type {typeof __VLS_components.aCheckbox | typeof __VLS_components.ACheckbox | typeof __VLS_components.aCheckbox | typeof __VLS_components.ACheckbox} */
        aCheckbox;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
            checked: (__VLS_ctx.showOnlyHD),
        }));
        const __VLS_182 = __VLS_181({
            checked: (__VLS_ctx.showOnlyHD),
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        const { default: __VLS_185 } = __VLS_183.slots;
        // @ts-ignore
        [magnets, magnets, showOnlyHD,];
        var __VLS_183;
        let __VLS_186;
        /** @ts-ignore @type {typeof __VLS_components.aCheckbox | typeof __VLS_components.ACheckbox | typeof __VLS_components.aCheckbox | typeof __VLS_components.ACheckbox} */
        aCheckbox;
        // @ts-ignore
        const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
            checked: (__VLS_ctx.showOnlySubtitle),
        }));
        const __VLS_188 = __VLS_187({
            checked: (__VLS_ctx.showOnlySubtitle),
        }, ...__VLS_functionalComponentArgsRest(__VLS_187));
        const { default: __VLS_191 } = __VLS_189.slots;
        // @ts-ignore
        [showOnlySubtitle,];
        var __VLS_189;
        let __VLS_192;
        /** @ts-ignore @type {typeof __VLS_components.aSelect | typeof __VLS_components.ASelect | typeof __VLS_components.aSelect | typeof __VLS_components.ASelect} */
        aSelect;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
            ...{ 'onChange': {} },
            value: (__VLS_ctx.sortBy),
            ...{ style: {} },
        }));
        const __VLS_194 = __VLS_193({
            ...{ 'onChange': {} },
            value: (__VLS_ctx.sortBy),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        let __VLS_197;
        const __VLS_198 = ({ change: {} },
            { onChange: (__VLS_ctx.handleSortChange) });
        const { default: __VLS_199 } = __VLS_195.slots;
        let __VLS_200;
        /** @ts-ignore @type {typeof __VLS_components.aSelectOption | typeof __VLS_components.ASelectOption | typeof __VLS_components.aSelectOption | typeof __VLS_components.ASelectOption} */
        aSelectOption;
        // @ts-ignore
        const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
            value: "size",
        }));
        const __VLS_202 = __VLS_201({
            value: "size",
        }, ...__VLS_functionalComponentArgsRest(__VLS_201));
        const { default: __VLS_205 } = __VLS_203.slots;
        // @ts-ignore
        [sortBy, handleSortChange,];
        var __VLS_203;
        let __VLS_206;
        /** @ts-ignore @type {typeof __VLS_components.aSelectOption | typeof __VLS_components.ASelectOption | typeof __VLS_components.aSelectOption | typeof __VLS_components.ASelectOption} */
        aSelectOption;
        // @ts-ignore
        const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
            value: "date",
        }));
        const __VLS_208 = __VLS_207({
            value: "date",
        }, ...__VLS_functionalComponentArgsRest(__VLS_207));
        const { default: __VLS_211 } = __VLS_209.slots;
        // @ts-ignore
        [];
        var __VLS_209;
        let __VLS_212;
        /** @ts-ignore @type {typeof __VLS_components.aSelectOption | typeof __VLS_components.ASelectOption | typeof __VLS_components.aSelectOption | typeof __VLS_components.ASelectOption} */
        aSelectOption;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
            value: "shareDate",
        }));
        const __VLS_214 = __VLS_213({
            value: "shareDate",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        const { default: __VLS_217 } = __VLS_215.slots;
        // @ts-ignore
        [];
        var __VLS_215;
        // @ts-ignore
        [];
        var __VLS_195;
        var __VLS_196;
        let __VLS_218;
        /** @ts-ignore @type {typeof __VLS_components.aList | typeof __VLS_components.AList | typeof __VLS_components.aList | typeof __VLS_components.AList} */
        aList;
        // @ts-ignore
        const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({
            itemLayout: "vertical",
            dataSource: (__VLS_ctx.filteredMagnets),
        }));
        const __VLS_220 = __VLS_219({
            itemLayout: "vertical",
            dataSource: (__VLS_ctx.filteredMagnets),
        }, ...__VLS_functionalComponentArgsRest(__VLS_219));
        const { default: __VLS_223 } = __VLS_221.slots;
        {
            const { renderItem: __VLS_224 } = __VLS_221.slots;
            const [{ item }] = __VLS_vSlot(__VLS_224);
            let __VLS_225;
            /** @ts-ignore @type {typeof __VLS_components.aListItem | typeof __VLS_components.AListItem | typeof __VLS_components.aListItem | typeof __VLS_components.AListItem} */
            aListItem;
            // @ts-ignore
            const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({}));
            const __VLS_227 = __VLS_226({}, ...__VLS_functionalComponentArgsRest(__VLS_226));
            const { default: __VLS_230 } = __VLS_228.slots;
            let __VLS_231;
            /** @ts-ignore @type {typeof __VLS_components.aListItemMeta | typeof __VLS_components.AListItemMeta} */
            aListItemMeta;
            // @ts-ignore
            const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
                title: (__VLS_ctx.renderMagnetTitle(item)),
                description: (`大小：${item.size} | 分享时间：${item.shareDate}`),
            }));
            const __VLS_233 = __VLS_232({
                title: (__VLS_ctx.renderMagnetTitle(item)),
                description: (`大小：${item.size} | 分享时间：${item.shareDate}`),
            }, ...__VLS_functionalComponentArgsRest(__VLS_232));
            {
                const { actions: __VLS_236 } = __VLS_228.slots;
                let __VLS_237;
                /** @ts-ignore @type {typeof __VLS_components.aButton | typeof __VLS_components.AButton | typeof __VLS_components.aButton | typeof __VLS_components.AButton} */
                aButton;
                // @ts-ignore
                const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
                    ...{ 'onClick': {} },
                    size: "small",
                }));
                const __VLS_239 = __VLS_238({
                    ...{ 'onClick': {} },
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_238));
                let __VLS_242;
                const __VLS_243 = ({ click: {} },
                    { onClick: (...[$event]) => {
                            if (!(__VLS_ctx.movieData))
                                return;
                            if (!(__VLS_ctx.magnets.length > 0))
                                return;
                            __VLS_ctx.copyMagnet(item);
                            // @ts-ignore
                            [filteredMagnets, renderMagnetTitle, copyMagnet,];
                        } });
                const { default: __VLS_244 } = __VLS_240.slots;
                // @ts-ignore
                [];
                var __VLS_240;
                var __VLS_241;
                let __VLS_245;
                /** @ts-ignore @type {typeof __VLS_components.aButton | typeof __VLS_components.AButton | typeof __VLS_components.aButton | typeof __VLS_components.AButton} */
                aButton;
                // @ts-ignore
                const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
                    ...{ 'onClick': {} },
                    type: "primary",
                    size: "small",
                }));
                const __VLS_247 = __VLS_246({
                    ...{ 'onClick': {} },
                    type: "primary",
                    size: "small",
                }, ...__VLS_functionalComponentArgsRest(__VLS_246));
                let __VLS_250;
                const __VLS_251 = ({ click: {} },
                    { onClick: (...[$event]) => {
                            if (!(__VLS_ctx.movieData))
                                return;
                            if (!(__VLS_ctx.magnets.length > 0))
                                return;
                            __VLS_ctx.downloadMagnet(item);
                            // @ts-ignore
                            [downloadMagnet,];
                        } });
                const { default: __VLS_252 } = __VLS_248.slots;
                // @ts-ignore
                [];
                var __VLS_248;
                var __VLS_249;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_228;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_221;
        // @ts-ignore
        [];
        var __VLS_177;
    }
}
// @ts-ignore
[];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};

<template>
    <div class="img-wrap">
        <img 
            v-if="src"
            :data-src="src"
            :alt="alt"
            v-lazy="noLazy"
        >
        <img v-else src="@/assets/none.png" alt="miss image">
    </div>
</template>
<script setup>
/* <image-lazy
    src="../src/assets/shark.png"
    alt="shark"
></image-lazy> */

import { ref, toRefs, reactive, computed } from 'vue';

const props = defineProps({
	src: {
		type: String,
		default: '',
	},
	alt: {
		type: String,
		default: 'a image',
	},
	lazy: {
		type: Boolean,
		default: false,
	},
});

const noLazy = computed(() => {
    return !props.lazy;
});

const vLazy = {
    // vue3 自动绑定 vLazy 指令， mounted 钩子函数
    mounted: (el, binding) => {
        // 非懒加载
        if (binding.value) {
            return el.src = el.dataset.src;
        }

        // 懒加载
        const io = new IntersectionObserver((entries) => {
            const realSrc = el.dataset.src;
            if (entries[0].isIntersecting) {
                // 进入可视区，去掉监听
                el.src = realSrc;
                io.unobserve(el);
            }
        });
        io.observe(el);
    }
}

</script>

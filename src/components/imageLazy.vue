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
    mounted: (el, binding) => {
        // 非懒加载
        if (binding.value) {
            return el.src = el.dataset.src;
        }

        // 懒加载
        
    }
}
</script>

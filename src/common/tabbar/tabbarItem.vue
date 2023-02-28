<template>
    <div class="tabbar-item" @click="itemClick">
        <template v-if="!isActive">
            <slot name="item-icon"></slot>
        </template>
        <template v-else>
            <slot name="item-icon-active"></slot>
        </template>
        <div :style="activeStyle">
            <slot name="item-text"></slot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
    path: String,
    activeColor: {
        type: String,
        default: '#fff'
    }
});

const route = useRoute();
const router = useRouter();

const itemClick = () => {
    router.replace({ path: props.path});
}

// const url = ref('');
const isActive = computed(() => route.path.indexOf(props.path) !== -1);
const activeStyle = computed(() => isActive.value ? { color: props.activeColor } : {});
        
watch(
    () => route.path,
    async (path) => {
        // url.value = path;
    }
);

</script>

<template>
    <div class="tab">
        <div class="tab-item" :class="{active: tab === 'tab1'}" @click="tab = 'tab1'">Tab1</div>
        <div class="tab-item" :class="{active: tab === 'tab2'}" @click="tab = 'tab2'">Tab2</div>
        <div class="tab-item" :class="{active: tab === 'tab3'}" @click="tab = 'tab3'">Tab3</div>
    </div>
    
    <div class="tab-list">
        <div class="tab-list-item" v-show="tab === 'tab1'">
            <div class="tab-list-item-title">Tab1</div>
            <div class="tab-list-item-content">Tab1 content</div>
        </div>
        <div class="tab-list-item" v-show="tab === 'tab2'">
            <div class="tab-list-item-title">Tab2</div>
            <div class="tab-list-item-content">Tab2 content</div>
        </div>
        <div class="tab-list-item" v-show="tab === 'tab3'">
            <div class="tab-list-item-title">Tab3</div>
            <div class="tab-list-item-content">Tab3 content</div>
        </div>
    </div>
</template>
<script setup>

</script>
<style scoped>
.tab {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 50px;
    background-color: #eee;
}
.tab-item {
    flex: 1;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
}
.tab-item.active {
    color: #fff;
    background-color: #000;
}
.tab-list {
    padding: 10px;
}
.tab-list-item {
    display: none;
}
.tab-list-item-title {
    font-size: 20px;
    font-weight: bold;
}
.tab-list-item-content {
    font-size: 16px;
}
</style>
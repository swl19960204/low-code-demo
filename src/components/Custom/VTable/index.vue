<script setup>
defineProps({
    prototies: {
        type: Object,
        default: () => { },
    }
})
</script>

<template>
    <table class="v-table">
        <tbody>
            <tr v-for="(item, index) in prototies?.data" :key="index" :class="{
                stripe: prototies?.stripe && index % 2,
                bold: prototies?.thBold && index === 0
            }">
                <td v-for="(e, i) in item" :key="i">{{ e }}</td>
            </tr>
        </tbody>
    </table>
</template>


<style lang="less" scoped>
.v-table {
    border-collapse: collapse;
    table-layout: fixed;
    word-break: break-all;
    word-wrap: break-word;

    td {
        border: 1px solid #ebeef5;
        height: 40px;
        width: 60px;
        padding: 10px;
    }

    .bold {
        font-weight: bold;
    }

    .stripe {
        background-color: #fafafa;
    }
}
</style>

<script setup lang="ts">
import PurchaseForm from '@/components/PurchaseForm.vue';
</script>

<template>
    <main>
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1 class="mb-4">Formulario de pedidos</h1>
                    <PurchaseForm />
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
main {
    background-color: #fafafa;
}
</style>

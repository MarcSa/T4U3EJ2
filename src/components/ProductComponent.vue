<script setup lang="ts">
import { watch } from 'vue';
import { useField } from 'vee-validate';
import type { Product } from '@/interfaces/product.interface';
import { useTotal } from '@/composable/total';
const props = defineProps<{ index: number; productCount: number }>();
const emit = defineEmits<{ (e: 'delete', value: number): void }>();

const {
    value: productName,
    errorMessage: productNameError,
    handleBlur: productNameBlur,
} = useField<Product['productName']>(() => `products[${props.index}].productName`);

const {
    value: quantity,
    errorMessage: quantityError,
    handleBlur: quantityBlur,
} = useField<Product['quantity']>(() => `products[${props.index}].quantity`);

const {
    value: price,
    errorMessage: priceError,
    handleBlur: priceBlur,
} = useField<Product['price']>(() => `products[${props.index}].price`);

const deleteProduct = () => {
    emit('delete', props.index);
};

const { productTotal } = useTotal(quantity, price);

const { setValue: setTotal } = useField<number>(() => `products[${props.index}].productTotal`);

watch(
    productTotal,
    (value) => {
        setTotal(value);
    },
    { immediate: true },
);
</script>
<template>
    <div class="card px-3 py-4 mb-3 bg-white">
        <h3>Producto {{ props.index + 1 }}</h3>

        <div class="mb-2">
            <label :for="`productName-${props.index}`" class="mb-2"> Nombre del producto: </label>
            <input
                type="text"
                v-model="productName"
                :id="`productName-${props.index}`"
                placeholder="Nombre del producto"
                @blur="productNameBlur"
                :class="{ invalid: !!productNameError }"
                :aria-invalid="!!productNameError"
                :aria-describedby="
                    productNameError ? `productName-error-${props.index}` : undefined
                "
            />
            <p v-if="productNameError" :id="`productName-error-${props.index}`" class="error">
                {{ productNameError }}
            </p>
        </div>

        <div class="mb-2">
            <label :for="`quantity-${props.index}`" class="mb-2"> Cantidad: </label>
            <input
                type="number"
                v-model="quantity"
                :id="`quantity-${props.index}`"
                placeholder="Cantidad"
                @blur="quantityBlur"
                :class="{ invalid: !!quantityError }"
                :aria-invalid="!!quantityError"
                :aria-describedby="quantityError ? `quantity-error-${props.index}` : undefined"
            />
            <p v-if="quantityError" :id="`quantity-error-${props.index}`" class="error">
                {{ quantityError }}
            </p>
        </div>

        <div class="mb-2">
            <label :for="`price-${props.index}`" class="mb-2"> Precio: </label>
            <input
                type="number"
                v-model="price"
                :id="`price-${props.index}`"
                placeholder="Precio"
                step="0.01"
                @blur="priceBlur"
                :class="{ invalid: !!priceError }"
                :aria-invalid="!!priceError"
                :aria-describedby="priceError ? `price-error-${props.index}` : undefined"
            />
            <p v-if="priceError" :id="`price-error-${props.index}`" class="error">
                {{ priceError }}
            </p>
        </div>
        <button
            type="button"
            class="btn btn-danger"
            :disabled="props.productCount < 2"
            @click="deleteProduct"
        >
            Eliminar producto
        </button>
    </div>
</template>

<style scoped lang="scss">
.error {
    color: red;
}

.invalid {
    outline: 1px solid red;
    border-radius: 2px;
}
</style>

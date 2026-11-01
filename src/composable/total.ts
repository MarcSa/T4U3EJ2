import { computed, type Ref } from 'vue';

export const useTotal = (quantity: Ref<number>, priceUnit: Ref<number>) => {
    const productTotal = computed(() => quantity.value * priceUnit.value);

    return { productTotal };
};

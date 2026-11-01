<script setup lang="ts">
import { useForm, useFieldArray } from 'vee-validate';
import * as yup from 'yup';
import ProductComponent from '@/components/ProductComponent.vue';
import type { Product } from '@/interfaces/product.interface';

const paymentMethods = ['Paypal', 'Tarjeta'];

const schema = yup.object({
    name: yup.string().required('El nombre del cliente es obligatorio').min(3).max(100),
    email: yup.string().required('El email del cliente es obligatorio').email(),
    paymentMethod: yup
        .string()
        .required('Debe seleccionar un método de pago')
        .oneOf(paymentMethods, 'Selecciona un método de pago válido'),
    products: yup
        .array()
        .min(1, 'Añade al menos un producto')
        .required('Los productos son obligatorios')
        .of(
            yup.object().shape({
                productName: yup
                    .string()
                    .min(3, 'Mínimo de 3 caracteres')
                    .max(100, 'Máximo 100 caracteres')
                    .required('El nombre de el producto es obligatorio'),
                quantity: yup
                    .number()
                    .typeError('Introduce una cantidad válida')
                    .integer('La cantidad debe ser un número entero')
                    .moreThan(0, 'La cantidad debe ser mayor que cero')
                    .required('La cantidad es obligatoria'),
                price: yup
                    .number()
                    .typeError('Introduce un precio válido')
                    .moreThan(0, 'El precio mínimo del producto es 1 €')
                    .required('El precio es obligatorio'),
            }),
        )
        .strict(),
});

// Valores iniciales
const initialValues = {
    name: '',
    email: '',
    paymentMethod: '',
    products: [
        {
            productName: '',
            quantity: 1,
            price: 0,
            productTotal: 0,
        },
    ],
};

const { errors, meta, defineField, handleSubmit } = useForm({
    validationSchema: schema,
    initialValues,
});

const { fields, push, remove } = useFieldArray<Product>('products');

// Add Product
const addProduct = (): void => {
    push({
        productName: '',
        quantity: 1,
        price: 0,
        productTotal: 0,
    });
};

// Campos
const [name, nameAtrrs] = defineField('name');
const [email, emailAtrrs] = defineField('email');
const [paymentMethod, paymentMethodAtrrs] = defineField('paymentMethod');

// Submit simulado
const onSubmit = handleSubmit((formValues) => {
    const total = formValues.products.reduce((acc, obj) => acc + obj.productTotal, 0);
    console.log('REGISTER payload', JSON.stringify({ ...formValues, total }));
});
</script>

<template>
    <form class="card px-3 py-4 bg-white form-content" @submit.prevent="onSubmit">
        <h2 class="mb-2">Primer formulario</h2>
        <div class="mb-2">
            <label for="name" class="mb-2">Nombre:</label>
            <input
                type="text"
                v-model="name"
                name="name"
                id="name"
                v-bind="nameAtrrs"
                placeholder="Nombre"
                :class="{ invalid: !!errors.name }"
                :aria-invalid="!!errors.name"
                aria-describedby="name-error"
            />
            <p v-if="errors.name" id="name-error" class="error">{{ errors.name }}</p>
        </div>
        <div class="mb-2">
            <label for="email" class="mb-2">Email:</label>
            <input
                type="text"
                v-model="email"
                name="email"
                id="email"
                v-bind="emailAtrrs"
                placeholder="tu@email.com"
                :class="{ invalid: !!errors.email }"
                :aria-invalid="!!errors.email"
                aria-describedby="email-error"
            />
            <p v-if="errors.email" id="email-error" class="error">{{ errors.email }}</p>
        </div>
        <div class="mb-2">
            <label for="paymentMethod" class="mb-2">Método de pago:</label>
            <select
                v-model="paymentMethod"
                name="paymentMethod"
                id="paymentMethod"
                v-bind="paymentMethodAtrrs"
                :class="{ invalid: !!errors.paymentMethod }"
                :aria-invalid="!!errors.paymentMethod"
                aria-describedby="paymentMethod-error"
            >
                <option disabled value="">Selecciona un método de pago</option>
                <option v-for="method in paymentMethods" :value="method" :key="method">
                    {{ method }}
                </option>
            </select>
            <p v-if="errors.paymentMethod" id="paymentMethod-error" class="error">
                {{ errors.paymentMethod }}
            </p>

            <h2>Línias de productos</h2>
            <hr />
            <ProductComponent
                v-for="(field, index) in fields"
                :key="field.key"
                :index="index"
                :productCount="fields.length"
                @delete="remove($event)"
            />
            <div class="addProductBtnContainer mb-3">
                <button type="button" class="btn btn-secondary" @click="addProduct">
                    Añadir Producto
                </button>
            </div>

            <input type="submit" class="btn btn-primary" value="Enviar" :disabled="!meta.valid" />
        </div>
    </form>
</template>

<style scoped lang="scss">
pre {
    background-color: #fafafa;
}
.error {
    color: red;
}
#email:not(.invalid) {
    margin-bottom: 12px;
}
.invalid {
    outline: 1px solid red;
    border-radius: 2px;
}
</style>

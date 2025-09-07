"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Product } from '../../../lib/types/database';
import { useProductStore } from '../../../store/productStore';

interface FormValues {
  sku: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  basePrice: number;
  minOrderQuantity: number;
  isActive: boolean;
}

const schema: yup.ObjectSchema<FormValues> = yup.object({
  sku: yup.string().required(),
  name: yup.string().required(),
  category: yup.string().required(),
  brand: yup.string().required(),
  description: yup.string().required(),
  length: yup.number().positive().required(),
  width: yup.number().positive().required(),
  height: yup.number().positive().required(),
  weight: yup.number().positive().required(),
  basePrice: yup.number().positive().required(),
  minOrderQuantity: yup.number().positive().required(),
  isActive: yup.boolean().required(),
});

interface Props {
  productId?: string;
  onSuccess?: () => void;
}

export const ProductForm: React.FC<Props> = ({ productId, onSuccess }) => {
  const { addProduct, updateProduct, getProduct } = useProductStore();
  const editing = Boolean(productId);
  const existing = productId ? getProduct(productId) : undefined;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: existing ? {
      sku: existing.sku,
      name: existing.name,
      category: existing.category,
      brand: existing.brand,
      description: existing.description,
      length: existing.dimensions.length,
      width: existing.dimensions.width,
      height: existing.dimensions.height,
      weight: existing.dimensions.weight,
      basePrice: existing.basePrice,
      minOrderQuantity: existing.minOrderQuantity,
      isActive: existing.isActive,
    } : { isActive: true, minOrderQuantity: 1 } as any
  });

  const onSubmit = async (values: FormValues) => {
    if (editing && productId) {
      await updateProduct(productId, {
        sku: values.sku,
        name: values.name,
        category: values.category,
        brand: values.brand,
        description: values.description,
        dimensions: {
          length: values.length,
          width: values.width,
          height: values.height,
          weight: values.weight,
        },
        basePrice: values.basePrice,
        minOrderQuantity: values.minOrderQuantity,
        isActive: values.isActive,
      } as Partial<Product>);
    } else {
      await addProduct({
        sku: values.sku,
        name: values.name,
        category: values.category,
        brand: values.brand,
        description: values.description,
        subcategory: '',
        dimensions: {
          length: values.length,
          width: values.width,
          height: values.height,
          weight: values.weight,
        },
        images: [],
        basePrice: values.basePrice,
        minOrderQuantity: values.minOrderQuantity,
        isActive: values.isActive,
      } as any);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700">SKU</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('sku')} />
          {errors.sku && <p className="mt-1 text-[10px] text-red-600">Required</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Name</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('name')} />
          {errors.name && <p className="mt-1 text-[10px] text-red-600">Required</p>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700">Category</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('category')} />
          {errors.category && <p className="mt-1 text-[10px] text-red-600">Required</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Brand</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('brand')} />
          {errors.brand && <p className="mt-1 text-[10px] text-red-600">Required</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Min Order Qty</label>
          <input type="number" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('minOrderQuantity', { valueAsNumber: true })} />
          {errors.minOrderQuantity && <p className="mt-1 text-[10px] text-red-600">Required</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700">Length</label>
          <input type="number" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('length', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Width</label>
          <input type="number" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('width', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Height</label>
          <input type="number" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('height', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Weight</label>
          <input type="number" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('weight', { valueAsNumber: true })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-700">Base Price</label>
          <input type="number" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('basePrice', { valueAsNumber: true })} />
          {errors.basePrice && <p className="mt-1 text-[10px] text-red-600">Required</p>}
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input type="checkbox" className="h-4 w-4" {...register('isActive')} />
          <span className="text-xs text-neutral-700">Active</span>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-700">Description</label>
        <textarea rows={3} className="mt-1 w-full resize-none rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900" {...register('description')} />
        {errors.description && <p className="mt-1 text-[10px] text-red-600">Required</p>}
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {editing ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

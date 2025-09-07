"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Warehouse } from '../../../lib/types/database';
import { useWarehouseStore } from '../../../store/warehouseStore';

const schema: yup.ObjectSchema<FormValues> = yup.object({
  name: yup.string().required('Name is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  totalSpace: yup.number().typeError('Total space must be a number').positive().required('Total space required'),
  manager: yup.string().required('Manager is required'),
  isActive: yup.boolean().required(),
});

interface FormValues {
  name: string;
  city: string;
  country: string;
  totalSpace: number;
  manager: string;
  isActive: boolean;
}

interface Props {
  onSuccess?: () => void;
  defaultValues?: Partial<FormValues>;
  warehouseId?: string;
}

export const WarehouseForm: React.FC<Props> = ({ onSuccess, defaultValues, warehouseId }) => {
  const { addWarehouse, updateWarehouse, getWarehouse } = useWarehouseStore();
  const editing = Boolean(warehouseId);
  const existing = warehouseId ? getWarehouse(warehouseId) : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
  resolver: yupResolver(schema),
    defaultValues: existing
      ? {
          name: existing.name,
          city: existing.address.city,
          country: existing.address.country,
          totalSpace: existing.capacity.totalSpace,
          manager: existing.manager,
          isActive: existing.isActive,
        }
      : { isActive: true, ...defaultValues },
  });

  const onSubmit: (values: FormValues) => Promise<void> = async (values) => {
    if (editing && warehouseId) {
      await updateWarehouse(warehouseId, {
        name: values.name,
        manager: values.manager,
        isActive: values.isActive,
        address: {
          ...(existing?.address || {}),
          city: values.city,
          country: values.country,
        },
        capacity: {
          totalSpace: values.totalSpace,
          usedSpace: existing?.capacity.usedSpace || 0,
          availableSpace: (existing?.capacity.totalSpace || values.totalSpace) - (existing?.capacity.usedSpace || 0),
        },
      } as Partial<Warehouse>);
    } else {
      await addWarehouse({
        name: values.name,
        manager: values.manager,
        isActive: values.isActive,
        address: {
          street: '',
          city: values.city,
          state: '',
          zipCode: '',
          country: values.country,
        },
        capacity: {
          totalSpace: values.totalSpace,
          usedSpace: 0,
          availableSpace: values.totalSpace,
        },
      } as any);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-700">Name</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20" {...register('name')} />
          {errors.name && <p className="mt-1 text-[10px] text-red-600">Name required</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Manager (User ID)</label>
            <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20" {...register('manager')} />
          {errors.manager && <p className="mt-1 text-[10px] text-red-600">Manager required</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-700">City</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20" {...register('city')} />
          {errors.city && <p className="mt-1 text-[10px] text-red-600">City required</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700">Country</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20" {...register('country')} />
          {errors.country && <p className="mt-1 text-[10px] text-red-600">Country required</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-700">Total Space (m³)</label>
          <input type="number" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/20" {...register('totalSpace', { valueAsNumber: true })} />
          {errors.totalSpace && <p className="mt-1 text-[10px] text-red-600">Provide total space</p>}
        </div>
        <div className="flex items-center gap-2 pt-5">
          <input type="checkbox" {...register('isActive')} className="h-4 w-4 rounded border-neutral-300" />
          <span className="text-xs text-neutral-700">Active</span>
        </div>
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {editing ? 'Update Warehouse' : 'Create Warehouse'}
        </button>
      </div>
    </form>
  );
};

export default WarehouseForm;

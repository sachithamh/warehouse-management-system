"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Shop } from '../../../lib/types/database';
import { useShopStore } from '../../../store/shopStore';

const schema = yup.object({
  name: yup.string().required(),
  ownerName: yup.string().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  businessLicense: yup.string().required(),
  taxId: yup.string().required(),
  creditLimit: yup.number().min(0).required(),
  paymentTerms: yup.number().min(0).required(),
  preferredDeliveryDays: yup.array(yup.string()).default([]),
  address: yup.object({
    street: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    zipCode: yup.string().required(),
    country: yup.string().required(),
  }),
  isActive: yup.boolean().default(true)
});

export type ShopFormValues = yup.InferType<typeof schema>;

interface Props {
  initial?: Partial<Shop>;
  onSuccess?: () => void;
}

const deliveryDayOptions = ['monday','tuesday','wednesday','thursday','friday','saturday'];

export default function ShopForm({ initial, onSuccess }: Props) {
  const { addShop, updateShop } = useShopStore();
  const isEdit = Boolean(initial?.id);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<ShopFormValues>({
    resolver: yupResolver(schema),
    defaultValues: initial as any || {
      name: '', ownerName: '', email: '', phone: '', businessLicense: '', taxId: '', creditLimit: 0, creditUsed: 0,
      paymentTerms: 30, preferredDeliveryDays: [], isActive: true,
      address: { street:'', city:'', state:'', zipCode:'', country:'' }
    }
  });

  const onSubmit = async (values: ShopFormValues) => {
    if (isEdit && initial?.id) {
      await updateShop(initial.id, values as any);
    } else {
      await addShop({ creditUsed: 0, ...values } as any);
      reset();
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Name</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1 text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-800 focus:outline-none" {...register('name')} />
          {errors.name && <p className="mt-1 text-[10px] text-red-600">Required</p>}
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Owner</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('ownerName')} />
          {errors.ownerName && <p className="mt-1 text-[10px] text-red-600">Required</p>}
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Email</label>
          <input type="email" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('email')} />
          {errors.email && <p className="mt-1 text-[10px] text-red-600">Invalid</p>}
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Phone</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('phone')} />
          {errors.phone && <p className="mt-1 text-[10px] text-red-600">Required</p>}
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Business License</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('businessLicense')} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Tax ID</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('taxId')} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Credit Limit</label>
          <input type="number" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('creditLimit', { valueAsNumber: true })} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Payment Terms (days)</label>
          <input type="number" className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('paymentTerms', { valueAsNumber: true })} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-medium text-neutral-600">Preferred Delivery Days</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {deliveryDayOptions.map(d => {
              const selected = watch('preferredDeliveryDays').includes(d);
              return (
                <button type="button" key={d} onClick={() => {
                  const current = watch('preferredDeliveryDays');
                  const next = selected ? current.filter(c => c!==d) : [...current, d];
                  (watch as any).setValue && (watch as any).setValue('preferredDeliveryDays', next);
                }} className={`rounded border px-2 py-1 text-[10px] ${selected? 'bg-neutral-900 text-white border-neutral-900':'bg-white border-neutral-300 text-neutral-700'}`}>{d.slice(0,3)}</button>
              );
            })}
          </div>
        </div>
      </div>
      <fieldset className="grid gap-3 rounded border border-neutral-200 p-3 sm:grid-cols-2">
        <legend className="px-1 text-[10px] font-medium uppercase tracking-wide text-neutral-500">Address</legend>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Street</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('address.street')} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">City</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('address.city')} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">State</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('address.state')} />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-neutral-600">Zip</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('address.zipCode')} />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-[11px] font-medium text-neutral-600">Country</label>
          <input className="mt-1 w-full rounded border border-neutral-300 bg-white px-2 py-1" {...register('address.country')} />
        </div>
      </fieldset>
      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-[11px] text-neutral-700">
          <input type="checkbox" {...register('isActive')} className="h-3 w-3" /> Active
        </label>
        <button disabled={isSubmitting} type="submit" className="rounded bg-neutral-900 px-4 py-2 text-[11px] font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
          {isEdit ? 'Update Shop' : 'Create Shop'}
        </button>
      </div>
    </form>
  );
}

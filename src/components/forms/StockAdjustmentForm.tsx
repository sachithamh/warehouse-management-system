"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { useInventoryStore } from '../../store/inventoryStore';

interface Props {
  itemId: string;
  onSuccess?: () => void;
}

interface FormValues {
  delta: number;
  note?: string;
}

export const StockAdjustmentForm: React.FC<Props> = ({ itemId, onSuccess }) => {
  const { adjustStock, getItem } = useInventoryStore();
  const item = getItem(itemId);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormValues>({ defaultValues: { delta: 0 } });

  if (!item) return <p className="text-sm text-neutral-500">Item not found</p>;

  const onSubmit = async (values: FormValues) => {
    if (values.delta !== 0) await adjustStock(itemId, values.delta);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-neutral-700">Adjustment (+/-)</label>
        <input type="number" className="mt-1 w-full rounded border border-neutral-300 px-2 py-1 text-sm" {...register('delta', { valueAsNumber: true })} />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-700">Note (optional)</label>
        <textarea rows={2} className="mt-1 w-full resize-none rounded border border-neutral-300 px-2 py-1 text-sm" {...register('note')} />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
      >Apply Adjustment</button>
    </form>
  );
};

export default StockAdjustmentForm;

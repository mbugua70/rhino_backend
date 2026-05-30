'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  text: z.string().min(1, 'Segment name is required'),
  fillStyle: z.string().min(1, 'Fill colour is required'),
  strokeStyle: z.string().min(1, 'Stroke colour is required'),
  textFillStyle: z.string().min(1, 'Text colour is required'),
  gift_number: z.coerce.number().int().min(0, 'Must be 0 or more'),
  quantity: z.coerce.number().int().min(0, 'Must be 0 or more'),
  is_active: z.boolean(),
  is_winnable: z.boolean(),
  sort_order: z.coerce.number().int().min(0, 'Must be 0 or more'),
})

const defaultValues = {
  text: '',
  fillStyle: '#10b981',
  strokeStyle: '#ffffff',
  textFillStyle: '#ffffff',
  gift_number: 0,
  quantity: 10,
  is_active: true,
  is_winnable: true,
  sort_order: 0,
}

function ColorField({ field, label }) {
  return (
    <FormItem>
      <FormLabel className="text-slate-300 text-xs">{label}</FormLabel>
      <FormControl>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg border border-white/20 shrink-0 shadow-sm"
            style={{ background: field.value }}
          />
          <div className="relative flex-1">
            <input
              type="color"
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Input
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="bg-white/5 border-white/10 text-white font-mono text-xs h-9 pl-2"
              placeholder="#000000"
            />
          </div>
        </div>
      </FormControl>
      <FormMessage className="text-red-400 text-xs" />
    </FormItem>
  )
}

export default function SegmentForm({ defaultData, onSubmit, isSubmitting }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultData
      ? {
          text: defaultData.text || '',
          fillStyle: defaultData.fillStyle || '#10b981',
          strokeStyle: defaultData.strokeStyle || '#ffffff',
          textFillStyle: defaultData.textFillStyle || '#ffffff',
          gift_number: defaultData.gift_number ?? 0,
          quantity: defaultData.quantity ?? 10,
          is_active: defaultData.is_active ?? true,
          is_winnable: defaultData.is_winnable ?? true,
          sort_order: defaultData.sort_order ?? 0,
        }
      : defaultValues,
  })

  useEffect(() => {
    if (defaultData) {
      form.reset({
        text: defaultData.text || '',
        fillStyle: defaultData.fillStyle || '#10b981',
        strokeStyle: defaultData.strokeStyle || '#ffffff',
        textFillStyle: defaultData.textFillStyle || '#ffffff',
        gift_number: defaultData.gift_number ?? 0,
        quantity: defaultData.quantity ?? 10,
        is_active: defaultData.is_active ?? true,
        is_winnable: defaultData.is_winnable ?? true,
        sort_order: defaultData.sort_order ?? 0,
      })
    }
  }, [defaultData])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Segment name */}
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-300 text-xs">Segment Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g. Event Jersey"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 h-9"
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Colours row */}
        <div className="grid grid-cols-3 gap-3">
          <FormField control={form.control} name="fillStyle" render={({ field }) => (
            <ColorField field={field} label="Fill Colour" />
          )} />
          <FormField control={form.control} name="strokeStyle" render={({ field }) => (
            <ColorField field={field} label="Stroke Colour" />
          )} />
          <FormField control={form.control} name="textFillStyle" render={({ field }) => (
            <ColorField field={field} label="Text Colour" />
          )} />
        </div>

        {/* Numbers row */}
        <div className="grid grid-cols-3 gap-3">
          <FormField
            control={form.control}
            name="gift_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 text-xs">Gift #</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    className="bg-white/5 border-white/10 text-white h-9"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 text-xs">Quantity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    className="bg-white/5 border-white/10 text-white h-9"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300 text-xs">Sort Order</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    className="bg-white/5 border-white/10 text-white h-9"
                  />
                </FormControl>
                <FormMessage className="text-red-400 text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <FormLabel className="text-slate-300 text-xs font-medium cursor-pointer">
                  Active
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_winnable"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                <FormLabel className="text-slate-300 text-xs font-medium cursor-pointer">
                  Winnable
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold h-10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving…
            </>
          ) : (
            'Save Segment'
          )}
        </Button>
      </form>
    </Form>
  )
}

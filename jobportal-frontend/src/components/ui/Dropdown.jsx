import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

/**
 * options: [{ label, value }]
 * Controlled: pass `value` (a raw option.value) and `onChange(value)`.
 */
export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = "Select…",
  error,
  className,
}) {
  const selected = options.find((option) => option.value === value) ?? null;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Listbox value={value} onChange={onChange}>
        {label && (
          <ListboxLabel className="text-sm font-medium text-ink-700">
            {label}
          </ListboxLabel>
        )}
        <div className="relative">
          <ListboxButton
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-lg border border-ink-200 bg-white px-3.5 text-left text-sm text-ink-900",
              "focus:border-brand-500 focus:outline-none",
              !selected && "text-ink-300",
              error && "border-red-500"
            )}
          >
            <span className="truncate">{selected ? selected.label : placeholder}</span>
            <ChevronDown className="h-4 w-4 shrink-0 text-ink-400" />
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded-lg border border-ink-100 bg-white py-1 text-sm shadow-lg focus:outline-none">
              {options.map((option) => (
                <ListboxOption
                  key={option.value}
                  value={option.value}
                  className={({ focus, selected: isSelected }) =>
                    cn(
                      "flex cursor-pointer items-center justify-between px-3.5 py-2.5",
                      focus && "bg-brand-50",
                      isSelected ? "font-medium text-brand-600" : "text-ink-700"
                    )
                  }
                >
                  {({ selected: isSelected }) => (
                    <>
                      <span className="truncate">{option.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-brand-500" />}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

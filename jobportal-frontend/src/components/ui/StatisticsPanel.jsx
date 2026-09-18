import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

/**
 * tabs: [{ label, panel: ReactNode }]
 * dateRangeLabel: static text for the date-range pill (no real picker yet).
 */
export function StatisticsPanel({ title, subtitle, tabs, dateRangeLabel }) {
  return (
    <Card>
      <TabGroup>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink-900">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-ink-500">{subtitle}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <TabList className="flex rounded-lg bg-ink-50 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.label}
                  className={({ selected }) =>
                    cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium outline-none",
                      selected ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
                    )
                  }
                >
                  {tab.label}
                </Tab>
              ))}
            </TabList>
            {dateRangeLabel && (
              <span className="flex items-center gap-1.5 rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-600">
                <CalendarDays className="h-4 w-4" />
                {dateRangeLabel}
              </span>
            )}
          </div>
        </div>

        <TabPanels className="mt-6">
          {tabs.map((tab) => (
            <TabPanel key={tab.label}>{tab.panel}</TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </Card>
  );
}

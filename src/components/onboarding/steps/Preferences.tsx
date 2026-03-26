import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Clock,
  Zap,
  Target,
  DollarSign,
  Globe,
  Building2,
  X,
  Check,
  Rocket,
  Plus,
} from "lucide-react";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { roleOptions, countryOptions } from "@/data/mock";

// ── Schema ─────────────────────────────────────────────────────────────────────

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD"] as const;
const MODALITIES = ["remote", "onsite", "hybrid"] as const;

const preferencesSchema = z
  .object({
    jobSearchTime: z.string().min(1, "Please set a search time"),
    applicationDelayMinutes: z.number().min(1).max(120),
    minApplicationsPerDay: z.number().min(1).max(50),
    maxApplicationsPerDay: z.number().min(1).max(50),
    preferredRoles: z.array(z.string()).min(0, "Select at least one role"),
    organizationBlacklist: z.array(z.string()),
    minSalary: z.number().min(0),
    currency: z.enum(CURRENCIES),
    modalities: z
      .array(z.enum(MODALITIES))
      .min(1, "Select at least one modality"),
    countries: z.array(z.string()).min(1, "Select at least one country"),
    autoApply: z.boolean(),
  })
  .refine((data) => data.minApplicationsPerDay <= data.maxApplicationsPerDay, {
    message: "Min must be ≤ max applications",
    path: ["minApplicationsPerDay"],
  });

type FormValues = z.infer<typeof preferencesSchema>;

// ── Defaults ───────────────────────────────────────────────────────────────────

const defaultValues: FormValues = {
  jobSearchTime: "09:00",
  applicationDelayMinutes: 5,
  minApplicationsPerDay: 3,
  maxApplicationsPerDay: 10,
  preferredRoles: [],
  organizationBlacklist: [],
  minSalary: 120000,
  currency: "USD",
  modalities: ["remote"],
  countries: ["United States", "Remote (Global)"],
  autoApply: true,
};

// ── Sub-components ─────────────────────────────────────────────────────────────

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function FormSection({ icon, title, description, children }: SectionProps) {
  return (
    <div className="bg-card rounded-xl border border-slate-100 p-5 shadow-sm">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = useCallback(
    (raw: string) => {
      const tag = raw.trim();
      if (tag && !value.includes(tag)) {
        onChange([...value, tag]);
      }
      setInputValue("");
    },
    [value, onChange],
  );

  const removeTag = useCallback(
    (tag: string) => {
      onChange(value.filter((t) => t !== tag));
    },
    [value, onChange],
  );

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              addTag(inputValue);
            } else if (
              e.key === "Backspace" &&
              inputValue === "" &&
              value.length > 0
            ) {
              onChange(value.slice(0, -1));
            }
          }}
          placeholder={placeholder ?? "Type and press Enter…"}
          className="flex-1 h-8 text-xs"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim()}
          className="shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

interface PillSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  maxVisible?: number;
}

function PillSelect({
  value,
  onChange,
  options,
  maxVisible = 999,
}: PillSelectProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? options : options.slice(0, maxVisible);

  const toggle = useCallback(
    (option: string) => {
      if (value.includes(option)) {
        onChange(value.filter((v) => v !== option));
      } else {
        onChange([...value, option]);
      }
    },
    [value, onChange],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {visible.map((option) => {
          const selected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                selected
                  ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/15"
                  : "bg-background text-muted-foreground border-border hover:border-slate-300 hover:text-foreground",
              )}
            >
              {selected && <Check className="h-3 w-3 shrink-0" />}
              {option}
            </button>
          );
        })}
      </div>

      {options.length > maxVisible && (
        <button
          type="button"
          onClick={() => setShowAll((s) => !s)}
          className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          {showAll
            ? "Show less"
            : `+${options.length - maxVisible} more options`}
        </button>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface PreferencesProps {
  onSubmit: () => void;
}

export default function Preferences({ onSubmit }: PreferencesProps) {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleFormSubmit = useCallback(
    (data: FormValues) => {
      console.log({ data });
      onSubmit();
    },
    [onSubmit],
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ── Left Column: Automation ────────────────────────────────────── */}
        <div className="space-y-5">
          <FormSection
            icon={<Zap className="h-3.5 w-3.5 text-primary" />}
            title="Automation Settings"
            description="Control when and how fast Career OS applies for you."
          >
            {/* Job Search Time */}
            <div>
              <Label
                htmlFor="jobSearchTime"
                className="mb-1.5 flex items-center gap-1.5"
              >
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                Daily search time
              </Label>
              <Input
                id="jobSearchTime"
                type="time"
                className="font-mono"
                {...register("jobSearchTime")}
              />
              {errors.jobSearchTime && (
                <p className="text-xs text-destructive mt-1">
                  {errors.jobSearchTime.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Career OS will scan for new roles at this time each day.
              </p>
            </div>

            {/* Application Delay */}
            <div>
              <Controller
                name="applicationDelayMinutes"
                control={control}
                render={({ field }) => (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Application delay</Label>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {field.value} min
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={60}
                      step={1}
                      value={[field.value]}
                      onValueChange={([v]) => field.onChange(v)}
                    />
                  </>
                )}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[11px] font-mono text-muted-foreground">
                  1 min
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  60 min
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Wait time between consecutive applications to appear natural.
              </p>
            </div>

            {/* Min / Max Applications */}
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="minApplicationsPerDay"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label htmlFor="minApps" className="mb-1.5 block">
                      Min / day
                    </Label>
                    <Input
                      id="minApps"
                      type="number"
                      min={1}
                      className="font-mono"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {errors.minApplicationsPerDay && (
                      <p className="text-[11px] text-destructive mt-1">
                        {errors.minApplicationsPerDay.message}
                      </p>
                    )}
                  </div>
                )}
              />
              <Controller
                name="maxApplicationsPerDay"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label htmlFor="maxApps" className="mb-1.5 block">
                      Max / day
                    </Label>
                    <Input
                      id="maxApps"
                      type="number"
                      max={50}
                      className="font-mono"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                    {errors.maxApplicationsPerDay && (
                      <p className="text-[11px] text-destructive mt-1">
                        {errors.maxApplicationsPerDay.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Auto Apply Toggle */}
            <Controller
              name="autoApply"
              control={control}
              render={({ field }) => (
                <div className="border-l-4 border-purple-400 bg-slate-50/70 rounded-r-lg px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Auto-apply
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {field.value
                          ? "Career OS will submit applications automatically."
                          : "Applications will queue for your review first."}
                      </p>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </div>
              )}
            />
          </FormSection>
        </div>

        {/* ── Right Column: Targeting ────────────────────────────────────── */}
        <div className="space-y-5">
          <FormSection
            icon={<Target className="h-3.5 w-3.5 text-primary" />}
            title="Targeting"
            description="Tell Career OS exactly what you're looking for."
          >
            {/* Preferred Roles */}
            <div>
              <Label className="mb-2 block">Preferred roles</Label>
              <Controller
                name="preferredRoles"
                control={control}
                render={({ field }) => (
                  <PillSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={roleOptions}
                    maxVisible={6}
                  />
                )}
              />
              {errors.preferredRoles && (
                <p className="text-xs text-destructive mt-1.5">
                  {errors.preferredRoles.message}
                </p>
              )}
            </div>

            {/* Work Modality */}
            <div>
              <Label className="mb-2 block">Work modality</Label>
              <Controller
                name="modalities"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-4">
                    {(
                      [
                        { value: "remote", label: "Remote" },
                        { value: "onsite", label: "On-site" },
                        { value: "hybrid", label: "Hybrid" },
                      ] as const
                    ).map((opt) => {
                      const checked = field.value.includes(opt.value);
                      return (
                        <div
                          key={opt.value}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            id={`modality-${opt.value}`}
                            checked={checked}
                            onCheckedChange={(c) => {
                              if (c) {
                                field.onChange([...field.value, opt.value]);
                              } else {
                                field.onChange(
                                  field.value.filter((v) => v !== opt.value),
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`modality-${opt.value}`}
                            className="text-sm text-foreground cursor-pointer select-none"
                          >
                            {opt.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              />
              {errors.modalities && (
                <p className="text-xs text-destructive mt-1.5">
                  {errors.modalities.message}
                </p>
              )}
            </div>

            {/* Minimum Salary */}
            <div>
              <Label className="mb-1.5 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                Minimum salary
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    className="font-mono"
                    {...register("minSalary", { valueAsNumber: true })}
                  />
                </div>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-22 font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c} className="font-mono">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {errors.minSalary && (
                <p className="text-xs text-destructive mt-1">
                  {errors.minSalary.message}
                </p>
              )}
            </div>

            {/* Countries */}
            <div>
              <Label className="mb-2 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                Countries
              </Label>
              <Controller
                name="countries"
                control={control}
                render={({ field }) => (
                  <PillSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={countryOptions}
                  />
                )}
              />
              {errors.countries && (
                <p className="text-xs text-destructive mt-1.5">
                  {errors.countries.message}
                </p>
              )}
            </div>

            {/* Company Blacklist */}
            <div>
              <Label className="mb-2 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                Company blacklist
              </Label>
              <Controller
                name="organizationBlacklist"
                control={control}
                render={({ field }) => (
                  <TagInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Company name, press Enter to add…"
                  />
                )}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Career OS will never apply to these companies.
              </p>
            </div>
          </FormSection>
        </div>
      </div>

      {/* ── Submit ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mt-6 flex items-center justify-between pt-5 border-t border-border"
      >
        <p className="text-xs text-muted-foreground">
          You can update these preferences at any time from the dashboard.
        </p>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="gap-2 min-w-40"
          onClick={() => {
            // Trigger validation feedback for empty required fields
            setValue("preferredRoles", []);
          }}
        >
          <Rocket className="h-4 w-4" />
          Launch Career OS
        </Button>
      </motion.div>
    </form>
  );
}

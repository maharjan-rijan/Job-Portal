import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Dropdown } from "@/components/ui/Dropdown";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import {
  resumeSchema,
  BLANK_EDUCATION_ENTRY,
  BLANK_EXPERIENCE_ENTRY,
  BLANK_SOCIAL_LINK_ENTRY,
  BLANK_ACHIEVEMENT_ENTRY,
} from "@/lib/validation/resumeSchema";
import { useSaveResume } from "@/hooks/useResume";
import { useAuth } from "@/hooks/useAuth";
import { SOCIAL_PLATFORMS } from "@/utils/constants";

const BLANK_RESUME = {
  title: "",
  location: "",
  website: "",
  expectedSalary: "",
  education: [BLANK_EDUCATION_ENTRY],
  experience: [],
  socialLinks: [],
  achievements: [],
};

/** Small header shared by every repeatable section: title + "Add" button. */
function SectionHeader({ title, onAdd, addLabel }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-semibold text-text">{title}</h2>
      <SecondaryButton type="button" size="sm" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        {addLabel}
      </SecondaryButton>
    </div>
  );
}

function RemoveRowButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-accent hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

/**
 * `resume`: the seeker's existing resume (from useMyResume()), or null
 * if they haven't built one yet. RHF's `values` option — not
 * `defaultValues` — is what keeps the form in sync once the resume
 * finishes loading asynchronously after this component has already
 * mounted; `defaultValues` alone only applies once, at mount.
 */
export function ResumeForm({ resume }) {
  const { user } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      ...BLANK_RESUME,
    },
    values: resume
      ? {
          name: resume.name ?? user?.name ?? "",
          email: resume.email ?? user?.email ?? "",
          ...BLANK_RESUME,
          ...resume,
          education: resume.education?.length
            ? resume.education
            : [BLANK_EDUCATION_ENTRY],
          experience: resume.experience ?? [],
          socialLinks: resume.socialLinks ?? [],
          achievements: resume.achievements ?? [],
        }
      : undefined,
  });

  const education = useFieldArray({ control, name: "education" });
  const experience = useFieldArray({ control, name: "experience" });
  const socialLinks = useFieldArray({ control, name: "socialLinks" });
  const achievements = useFieldArray({ control, name: "achievements" });

  const { mutate, isPending } = useSaveResume();

  const onSubmit = (values) => {
    mutate(values, {
      onSuccess: () => toast.success("Resume saved"),
      onError: (error) => toast.error(error.message ?? "Could not save resume"),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card>
        <h2 className="text-base font-semibold text-text">Basic Information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Name"
            error={errors.name?.message}
            {...register("name")}
          />
          <TextInput
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextInput
            label="Professional Title"
            placeholder="e.g. Front-end Developer"
            error={errors.title?.message}
            {...register("title")}
          />
          <TextInput
            label="Location"
            placeholder="City, Country"
            error={errors.location?.message}
            {...register("location")}
          />
          <TextInput
            label="Website"
            placeholder="https://your-portfolio.com"
            error={errors.website?.message}
            {...register("website")}
          />
          <TextInput
            label="Expected Salary"
            placeholder="e.g. $60,000/yr"
            error={errors.expectedSalary?.message}
            {...register("expectedSalary")}
          />
        </div>
      </Card>

      {/* Education — at least one entry required */}
      <Card>
        <SectionHeader
          title="Education"
          addLabel="Add Education"
          onAdd={() => education.append(BLANK_EDUCATION_ENTRY)}
        />
        {errors.education?.root?.message && (
          <p className="mt-2 text-xs text-red-600">
            {errors.education.root.message}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-5">
          {education.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-4 border-t border-primary/10 pt-4 first:border-0 first:pt-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Degree"
                    placeholder="e.g. Bachelor's"
                    error={errors.education?.[index]?.degree?.message}
                    {...register(`education.${index}.degree`)}
                  />
                  <TextInput
                    label="Field of Study"
                    placeholder="e.g. Computer Science"
                    error={errors.education?.[index]?.fieldOfStudy?.message}
                    {...register(`education.${index}.fieldOfStudy`)}
                  />
                  <TextInput
                    label="School"
                    error={errors.education?.[index]?.school?.message}
                    {...register(`education.${index}.school`)}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <TextInput
                      label="From"
                      placeholder="2018"
                      error={errors.education?.[index]?.from?.message}
                      {...register(`education.${index}.from`)}
                    />
                    <TextInput
                      label="To"
                      placeholder="2022"
                      error={errors.education?.[index]?.to?.message}
                      {...register(`education.${index}.to`)}
                    />
                  </div>
                </div>
                {education.fields.length > 1 && (
                  <RemoveRowButton
                    onClick={() => education.remove(index)}
                    label="Remove this education entry"
                  />
                )}
              </div>
              <Controller
                control={control}
                name={`education.${index}.description`}
                render={({ field: controllerField }) => (
                  <RichTextEditor
                    label="Description (Optional)"
                    error={errors.education?.[index]?.description?.message}
                    value={controllerField.value}
                    onChange={controllerField.onChange}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Work experience — optional, any number of entries */}
      <Card>
        <SectionHeader
          title="Work Experience"
          addLabel="Add Experience"
          onAdd={() => experience.append(BLANK_EXPERIENCE_ENTRY)}
        />
        <div className="mt-4 flex flex-col gap-5">
          {experience.fields.length === 0 && (
            <p className="text-sm text-accent">No work experience added yet.</p>
          )}
          {experience.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-4 border-t border-primary/10 pt-4 first:border-0 first:pt-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Company Name"
                    error={errors.experience?.[index]?.companyName?.message}
                    {...register(`experience.${index}.companyName`)}
                  />
                  <TextInput
                    label="Job Title"
                    error={errors.experience?.[index]?.jobTitle?.message}
                    {...register(`experience.${index}.jobTitle`)}
                  />
                  <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                    <TextInput
                      label="From"
                      placeholder="2022"
                      error={errors.experience?.[index]?.from?.message}
                      {...register(`experience.${index}.from`)}
                    />
                    <TextInput
                      label="To"
                      placeholder="Present"
                      error={errors.experience?.[index]?.to?.message}
                      {...register(`experience.${index}.to`)}
                    />
                  </div>
                </div>
                <RemoveRowButton
                  onClick={() => experience.remove(index)}
                  label="Remove this experience entry"
                />
              </div>
              <Controller
                control={control}
                name={`experience.${index}.description`}
                render={({ field: controllerField }) => (
                  <RichTextEditor
                    label="Description (Optional)"
                    error={errors.experience?.[index]?.description?.message}
                    value={controllerField.value}
                    onChange={controllerField.onChange}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Social links — optional, any number of entries */}
      <Card>
        <SectionHeader
          title="Social Links"
          addLabel="Add Link"
          onAdd={() => socialLinks.append(BLANK_SOCIAL_LINK_ENTRY)}
        />
        <div className="mt-4 flex flex-col gap-4">
          {socialLinks.fields.length === 0 && (
            <p className="text-sm text-accent">No social links added yet.</p>
          )}
          {socialLinks.fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-3">
              <div className="w-40 shrink-0">
                <Controller
                  control={control}
                  name={`socialLinks.${index}.platform`}
                  render={({ field: controllerField }) => (
                    <Dropdown
                      label="Platform"
                      placeholder="Select"
                      options={SOCIAL_PLATFORMS.map((p) => ({
                        label: p,
                        value: p,
                      }))}
                      value={controllerField.value}
                      onChange={controllerField.onChange}
                      error={errors.socialLinks?.[index]?.platform?.message}
                    />
                  )}
                />
              </div>
              <div className="flex-1">
                <TextInput
                  label="URL"
                  placeholder="https://linkedin.com/in/you"
                  error={errors.socialLinks?.[index]?.url?.message}
                  {...register(`socialLinks.${index}.url`)}
                />
              </div>
              <RemoveRowButton
                onClick={() => socialLinks.remove(index)}
                label="Remove this link"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements / certificates — optional, any number of entries */}
      <Card>
        <SectionHeader
          title="Achievements & Certificates"
          addLabel="Add Achievement"
          onAdd={() => achievements.append(BLANK_ACHIEVEMENT_ENTRY)}
        />
        <div className="mt-4 flex flex-col gap-5">
          {achievements.fields.length === 0 && (
            <p className="text-sm text-accent">Nothing added yet.</p>
          )}
          {achievements.fields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-4 border-t border-primary/10 pt-4 first:border-0 first:pt-0"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid flex-1 gap-4 sm:grid-cols-3">
                  <TextInput
                    label="Title"
                    placeholder="e.g. AWS Certified Developer"
                    error={errors.achievements?.[index]?.title?.message}
                    {...register(`achievements.${index}.title`)}
                  />
                  <TextInput
                    label="Issuer (optional)"
                    placeholder="e.g. Amazon"
                    error={errors.achievements?.[index]?.issuer?.message}
                    {...register(`achievements.${index}.issuer`)}
                  />
                  <TextInput
                    label="Date (optional)"
                    placeholder="e.g. 2025"
                    error={errors.achievements?.[index]?.date?.message}
                    {...register(`achievements.${index}.date`)}
                  />
                </div>
                <RemoveRowButton
                  onClick={() => achievements.remove(index)}
                  label="Remove this achievement"
                />
              </div>
              <Controller
                control={control}
                name={`achievements.${index}.description`}
                render={({ field: controllerField }) => (
                  <RichTextEditor
                    label="Description (optional)"
                    error={errors.achievements?.[index]?.description?.message}
                    value={controllerField.value}
                    onChange={controllerField.onChange}
                  />
                )}
              />
            </div>
          ))}
        </div>
      </Card>

      <PrimaryButton
        type="submit"
        isLoading={isSubmitting || isPending}
        className="w-fit"
      >
        Save resume
      </PrimaryButton>
    </form>
  );
}

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { contactSchema } from "@/lib/validation/contactSchema";
import { contactService } from "@/services/contactService";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", phone: "", message: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: contactService.send,
    onSuccess: () => {
      toast.success("Message sent — we'll get back to you soon.");
      reset();
    },
    onError: (error) => {
      toast.error(error.message ?? "Could not send your message");
    },
  });

  return (
    <form onSubmit={handleSubmit(mutate)} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Your name"
          placeholder="Jane Doe"
          error={errors.name?.message}
          {...register("name")}
        />
        <TextInput
          label="Your email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Subject"
          placeholder="How can we help?"
          error={errors.subject?.message}
          {...register("subject")}
        />
        <TextInput
          label="Phone (optional)"
          type="tel"
          placeholder="+1 (555) 000-0000"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
      <TextArea
        label="Message"
        placeholder="Tell us a bit about what you need"
        error={errors.message?.message}
        {...register("message")}
      />
      <Button type="submit" isLoading={isPending} className="mt-2 w-full sm:w-fit">
        Send message
      </Button>
    </form>
  );
}

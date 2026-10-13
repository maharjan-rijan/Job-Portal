import { Link } from "react-router-dom";
import { ArrowLeft, Pencil, Printer, Download, Palette } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { QueryState } from "@/components/ui/QueryState";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { Avatar } from "@/components/ui/Avatar";
import { TemplatePicker } from "@/components/resume/TemplatePicker";
import {
  useResume,
  useSaveResume,
  useDownloadMyResumePdf,
} from "@/hooks/useResume";
import { useAuth } from "@/hooks/useAuth";

export function ResumePreview() {
  const { user } = useAuth();
  const { data: resume, isLoading, isError } = useResume();
  const { mutate: saveResume, isPending: isSaving } = useSaveResume();
  const { mutate: downloadPdf, isPending: isDownloading } =
    useDownloadMyResumePdf();

  const handleTemplateChange = ({ template, color }) => {
    saveResume(
      { ...resume, template, color },
      {
        onError: (error) =>
          toast.error(error.message ?? "Could not save your selection"),
      },
    );
  };

  const handleDownload = () => {
    downloadPdf(undefined, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "my-resume.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      },
      onError: (error) => {
        toast.error(error.message ?? "Could not download your resume");
      },
    });
  };

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      errorLabel="Could not load your resume"
    >
      {!resume ? (
        <Card className="py-16 text-center">
          <p className="text-sm text-accent">
            You haven't built your resume yet.
          </p>
          <Link
            to="/seeker/resume"
            className="mt-3 inline-block text-sm font-medium text-secondary hover:underline"
          >
            Build your resume
          </Link>
        </Card>
      ) : (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1">
            <Link
              to="/seeker/resume"
              className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-primary print:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to editing
            </Link>

            <Card className="mt-6 print:hidden">
              <div className="flex items-center gap-2 text-sm font-medium text-text">
                <Palette className="h-4 w-4 text-secondary" />
                Template &amp; color
              </div>
              <p className="mt-1 text-xs text-accent">
                This is what employers see when they view your resume — changes
                save automatically.
              </p>
              <div className="mt-4">
                <TemplatePicker
                  template={resume.template}
                  color={resume.color}
                  onChange={handleTemplateChange}
                  disabled={isSaving}
                />
              </div>
            </Card>

            <div className="mt-6 rounded-xl border border-primary/10 bg-white p-8 shadow-sm">
              <ResumeTemplate
                resume={{
                  ...resume,
                  name: resume.name ?? user?.name,
                  avatarUrl: resume.avatarUrl ?? user?.avatar_url,
                }}
              />
            </div>
          </div>

          <div className="mt-10 w-full shrink-0 print:hidden lg:sticky lg:top-6 lg:w-80">
            <Card className="text-center">
              <Avatar
                src={resume.avatarUrl ?? user?.avatar_url}
                name={resume.name ?? user?.name}
                size={80}
                className="mx-auto text-2xl font-semibold text-white"
                style={{ backgroundColor: resume.color || "#0f172a" }}
              />
              <h2 className="mt-3 text-base font-semibold text-text">
                {resume.name ?? user?.name}
              </h2>
              <p className="text-sm text-secondary">{resume.title}</p>
              <p className="mt-1 text-xs text-accent">{resume.location}</p>

              <div className="mt-5 flex flex-col gap-2 border-t border-primary/10 pt-5">
                <PrimaryButton
                  as={Link}
                  to="/seeker/resume"
                  className="w-full justify-center"
                >
                  <Pencil className="h-4 w-4" />
                  Edit resume
                </PrimaryButton>
                <SecondaryButton
                  onClick={() => window.print()}
                  className="w-full justify-center"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </SecondaryButton>
                <SecondaryButton
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full justify-center"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? "Preparing…" : "Download PDF"}
                </SecondaryButton>
              </div>
            </Card>
          </div>
        </div>
      )}
    </QueryState>
  );
}

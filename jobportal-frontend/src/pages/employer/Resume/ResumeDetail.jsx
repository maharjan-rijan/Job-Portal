import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Printer, Download } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { NotFound } from "@/pages/public/NotFound";
import { Avatar } from "@/components/ui/Avatar";
import { useResumeDetail, useDownloadResumePdf } from "@/hooks/useResume";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";

export function ResumeDetail() {
  const { resumeId } = useParams();
  const { data: resume, isLoading, isError } = useResumeDetail(resumeId);
  const { mutate: downloadPdf, isPending: isDownloading } = useDownloadResumePdf();

  if (isLoading) return <Spinner fullSection />;

  if (isError || !resume) return <NotFound />;

  const handleDownload = () => {
    downloadPdf(resume.id, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${resume.name?.replace(/\s+/g, "-").toLowerCase() || "resume"}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      },
      onError: (error) => {
        toast.error(error.message ?? "Could not download this resume");
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex-1">
        <Link
          to="/employer/resumes"
          className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-primary print:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to resumes
        </Link>
        <div className="mt-6 rounded-xl border border-primary/10 bg-white p-8 shadow-sm">
          <ResumeTemplate resume={resume} />
        </div>
      </div>

      <div className="mt-10 w-full shrink-0 print:hidden lg:sticky lg:top-6 lg:w-80">
        <Card className="text-center">
          <Avatar
            src={resume.avatarUrl}
            name={resume.name}
            size={80}
            className="mx-auto text-2xl font-semibold text-white"
            style={{ backgroundColor: resume.color || "#0f172a" }}
          />
          <h2 className="mt-3 text-base font-semibold text-text">{resume.name}</h2>
          <p className="text-sm text-secondary">{resume.title}</p>
          <p className="mt-1 text-xs text-accent">{resume.location}</p>

          <div className="mt-5 flex flex-col gap-2 border-t border-primary/10 pt-5">
            <SecondaryButton onClick={() => window.print()} className="w-full justify-center">
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
  );
}

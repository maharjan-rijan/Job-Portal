import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/resumeService";
import { queryKeys } from "@/lib/queryKeys";

/** The logged-in seeker's own resume. */
export function useResume(options = {}) {
  return useQuery({
    queryKey: queryKeys.resumes.mine,
    queryFn: resumeService.getMine,
    enabled: options.enabled ?? true,
  });
}

export function useSaveResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resumeService.save,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.resumes.mine, updated);
    },
  });
}

/** Employer-only: browse candidate resumes, optionally filtered by keyword. */
export function useResumes(filters) {
  return useQuery({
    queryKey: queryKeys.resumes.list(filters),
    queryFn: () => resumeService.list(filters),
  });
}

/** Employer-only: a single candidate's resume by id. */
export function useResumeDetail(id) {
  return useQuery({
    queryKey: queryKeys.resumes.detail(id),
    queryFn: () => resumeService.getById(id),
    enabled: Boolean(id),
  });
}

/** Downloads the logged-in seeker's own resume as a PDF. */
export function useDownloadMyResumePdf() {
  return useMutation({
    mutationFn: resumeService.downloadMyPdf,
  });
}

/** Employer-only: downloads a specific candidate's resume as a PDF. */
export function useDownloadResumePdf() {
  return useMutation({
    mutationFn: resumeService.downloadPdf,
  });
}
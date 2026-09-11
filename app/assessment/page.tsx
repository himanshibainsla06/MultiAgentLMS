import AssessmentForm from "@/components/assessment-form";

type AssessmentSearchParams = {
  subject?: string;
  topic?: string;
};

export default async function AssessmentPage({
  searchParams,
}: {
  searchParams?: Promise<AssessmentSearchParams>;
}) {
  const params = searchParams ? await searchParams : {};

  return (
    <AssessmentForm
      initialSubject={params.subject ?? ""}
      initialTopic={params.topic ?? ""}
    />
  );
}


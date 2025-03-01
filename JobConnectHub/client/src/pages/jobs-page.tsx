import { useQuery } from "@tanstack/react-query";
import { Job } from "@shared/schema";
import JobCard from "@/components/job-card";
import { useAuth } from "@/hooks/use-auth";
import JobForm from "@/components/job-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function JobsPage() {
  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);

  if (!jobs) return null;

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Jobs</h1>
        {user?.userType === "employer" && !showJobForm && (
          <Button onClick={() => setShowJobForm(true)}>Post a Job</Button>
        )}
      </div>

      {showJobForm && (
        <div className="mb-8">
          <JobForm onCancel={() => setShowJobForm(false)} />
        </div>
      )}

      <div className="relative mb-8">
        <Input
          placeholder="Search jobs by title, description or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            showApplyButton={user?.userType === "seeker"}
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No jobs found matching your search criteria.
        </div>
      )}
    </div>
  );
}

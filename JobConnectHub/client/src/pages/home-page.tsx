import { useQuery } from "@tanstack/react-query";
import { Job, Application } from "@shared/schema";
import JobCard from "@/components/job-card";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Briefcase, Building, Users, ChevronRight } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { data: jobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });
  const { data: applications } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
    enabled: user?.userType === "seeker",
  });
  const { data: postedJobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs/posted"],
    enabled: user?.userType === "employer",
  });

  if (!user || !jobs) return null;

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="dashboard-header mb-12">
          <h1 className="text-4xl font-bold">Welcome back, {user.username}!</h1>
          <p className="text-muted-foreground mt-2">
            {user.userType === "seeker"
              ? "Here's an overview of your job search progress"
              : "Manage your job postings and view applications"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {user.userType === "seeker" ? (
            <>
              <Card className="stat-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="icon-circle">
                        <Briefcase className="h-5 w-5" />
                      </span>
                      <h3 className="font-medium">Total Applications</h3>
                    </div>
                    <span className="text-3xl font-bold text-primary">{applications?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="stat-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="icon-circle">
                        <Building className="h-5 w-5" />
                      </span>
                      <h3 className="font-medium">Available Jobs</h3>
                    </div>
                    <span className="text-3xl font-bold text-primary">{jobs.length}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="stat-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="icon-circle">
                        <Users className="h-5 w-5" />
                      </span>
                      <h3 className="font-medium">Profile Views</h3>
                    </div>
                    <span className="text-3xl font-bold text-primary">0</span>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="stat-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="icon-circle">
                        <Briefcase className="h-5 w-5" />
                      </span>
                      <h3 className="font-medium">Active Listings</h3>
                    </div>
                    <span className="text-3xl font-bold text-primary">{postedJobs?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="stat-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="icon-circle">
                        <Users className="h-5 w-5" />
                      </span>
                      <h3 className="font-medium">Total Applicants</h3>
                    </div>
                    <span className="text-3xl font-bold text-primary">0</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="stat-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="icon-circle">
                        <Building className="h-5 w-5" />
                      </span>
                      <h3 className="font-medium">Positions Filled</h3>
                    </div>
                    <span className="text-3xl font-bold text-primary">0</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="space-y-6">
          {user.userType === "seeker" ? (
            <Card className="hover-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                <h2 className="text-2xl font-bold">Recent Job Listings</h2>
                <Link href="/jobs">
                  <Button variant="outline" className="flex items-center group">
                    View All
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.slice(0, 4).map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="hover-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                <h2 className="text-2xl font-bold">Your Job Postings</h2>
                <Link href="/jobs">
                  <Button className="shadow-lg hover:shadow-xl transition-shadow">
                    Post New Job
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {postedJobs?.length ? (
                    postedJobs.map((job) => (
                      <JobCard key={job.id} job={job} showApplyButton={false} />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-12 bg-muted/50 rounded-lg">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        You haven't posted any jobs yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
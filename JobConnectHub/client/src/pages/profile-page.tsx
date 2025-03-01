import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Application, Job } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Mail, User, Calendar } from "lucide-react";
import JobCard from "@/components/job-card";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: applications } = useQuery<(Application & { job: Job })[]>({
    queryKey: ["/api/applications"],
  });
  const { data: postedJobs } = useQuery<Job[]>({
    queryKey: ["/api/jobs/posted"],
    enabled: user?.userType === "employer",
  });

  if (!user) return null;

  return (
    <div className="gradient-bg min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Profile Overview Card */}
          <Card className="hover-card">
            <CardHeader>
              <h2 className="dashboard-header text-3xl font-bold">Profile Overview</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <span className="icon-circle">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="icon-circle">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="icon-circle">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{user.location || "Not specified"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <span className="icon-circle">
                      <Briefcase className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm text-muted-foreground">Account Type</p>
                      <p className="font-medium capitalize">{user.userType}</p>
                    </div>
                  </div>
                  {user.userType === "employer" && user.companyName && (
                    <div className="flex items-center space-x-4">
                      <span className="icon-circle">
                        <Briefcase className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{user.companyName}</p>
                      </div>
                    </div>
                  )}
                  {user.userType === "seeker" && (
                    <>
                      {user.title && (
                        <div className="flex items-center space-x-4">
                          <span className="icon-circle">
                            <Briefcase className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm text-muted-foreground">Title</p>
                            <p className="font-medium">{user.title}</p>
                          </div>
                        </div>
                      )}
                      {user.bio && (
                        <div className="mt-6">
                          <p className="text-sm text-muted-foreground mb-2">Bio</p>
                          <p className="font-medium bg-muted/50 p-4 rounded-lg">{user.bio}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Seeker: Applications */}
          {user.userType === "seeker" && applications && (
            <Card className="hover-card overflow-hidden">
              <CardHeader>
                <h2 className="dashboard-header text-2xl font-bold">My Applications</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.length === 0 ? (
                    <div className="text-center py-12 bg-muted/50 rounded-lg">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        You haven't applied to any jobs yet.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg overflow-hidden border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Job Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Applied On</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications.map((application) => (
                            <TableRow key={application.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">
                                {application.job?.title || "Job Removed"}
                              </TableCell>
                              <TableCell>
                                <span className={`status-badge ${
                                  application.status === "accepted"
                                    ? "status-accepted"
                                    : application.status === "rejected"
                                    ? "status-rejected"
                                    : "status-pending"
                                }`}>
                                  {application.status}
                                </span>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(application.createdAt!).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Employer: Posted Jobs */}
          {user.userType === "employer" && postedJobs && (
            <Card className="hover-card">
              <CardHeader className="flex flex-row justify-between items-center">
                <h2 className="dashboard-header text-2xl font-bold">Posted Jobs</h2>
                <Button onClick={() => window.location.href = "/jobs"} className="shadow-lg hover:shadow-xl transition-shadow">
                  Post New Job
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {postedJobs.length === 0 ? (
                    <div className="col-span-2 text-center py-12 bg-muted/50 rounded-lg">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        You haven't posted any jobs yet.
                      </p>
                    </div>
                  ) : (
                    postedJobs.map((job) => (
                      <JobCard key={job.id} job={job} showApplyButton={false} />
                    ))
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
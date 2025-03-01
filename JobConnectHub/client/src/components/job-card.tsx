import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "@shared/schema";
import { MapPin, Building, Clock } from "lucide-react";

interface JobCardProps {
  job: Job;
  onApply?: () => void;
  showApplyButton?: boolean;
}

export default function JobCard({
  job,
  onApply,
  showApplyButton = true,
}: JobCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{job.title}</h3>
            <p className="text-sm text-muted-foreground">
              <Building className="inline-block w-4 h-4 mr-1" />
              {job.companyName}
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <Clock className="inline-block w-4 h-4 mr-1" />
            {new Date(job.createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              <MapPin className="inline-block w-4 h-4 mr-1" />
              {job.location}
            </p>
            <p className="text-sm font-medium">{job.salary}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Requirements:</h4>
            <p className="text-sm text-muted-foreground">{job.requirements}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Description:</h4>
            <p className="text-sm text-muted-foreground">{job.description}</p>
          </div>
        </div>
      </CardContent>
      {showApplyButton && (
        <CardFooter>
          <Button onClick={onApply} className="w-full">
            Apply Now
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

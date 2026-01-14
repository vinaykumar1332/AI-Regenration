import { useState } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table/table";
import { Badge } from "@/app/components/ui/Badge/badge";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const mockFailedJobs = [
  {
    id: "JOB-001",
    type: "Image",
    errorReason: "Invalid input parameters",
    timestamp: "2026-01-13 10:45 AM",
    details: "Resolution exceeded maximum allowed dimensions (8000x8000)",
  },
  {
    id: "JOB-002",
    type: "Video",
    errorReason: "Timeout exceeded",
    timestamp: "2026-01-13 10:30 AM",
    details: "Generation took longer than 5 minutes timeout limit",
  },
  {
    id: "JOB-003",
    type: "Image",
    errorReason: "Content policy violation",
    timestamp: "2026-01-13 10:15 AM",
    details: "Prompt contained restricted keywords",
  },
  {
    id: "JOB-004",
    type: "Video",
    errorReason: "Insufficient resources",
    timestamp: "2026-01-13 10:00 AM",
    details: "GPU memory limit exceeded for 4K resolution",
  },
];

export function FailedJobsPage() {
  const [failedJobs, setFailedJobs] = useState(mockFailedJobs);
  const [expandedId, setExpandedId] = useState(null);

  const handleRetry = (jobId) => {
    toast.success(`Retrying job ${jobId}`);
  };

  const handleRetryAll = () => {
    toast.success("Retrying all failed jobs");
  };

  const toggleExpand = (jobId) => {
    setExpandedId(expandedId === jobId ? null : jobId);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Failed Jobs</h1>
          <p className="text-muted-foreground">Review and retry failed generation attempts</p>
        </div>
        <Button onClick={handleRetryAll}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Failed</p>
          <p className="text-2xl font-semibold">{failedJobs.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Last 24 Hours</p>
          <p className="text-2xl font-semibold">12</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
          <p className="text-2xl font-semibold">96.7%</p>
        </Card>
      </div>

      {/* Failed Jobs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Job ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Error Reason</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {failedJobs.map((job) => (
              <>
                <TableRow key={job.id} className="cursor-pointer" onClick={() => toggleExpand(job.id)}>
                  <TableCell>
                    {expandedId === job.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{job.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{job.type}</Badge>
                  </TableCell>
                  <TableCell className="text-red-600">{job.errorReason}</TableCell>
                  <TableCell className="text-muted-foreground">{job.timestamp}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetry(job.id);
                      }}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedId === job.id && (
                  <TableRow>
                    <TableCell colSpan={6} className="bg-muted/30">
                      <div className="p-4">
                        <h4 className="font-medium mb-2">Error Details</h4>
                        <p className="text-sm text-muted-foreground">{job.details}</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}














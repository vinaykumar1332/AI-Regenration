import { useState } from "react";
import { Card } from "@/app/components/ui/Card/card";
import { Button } from "@/app/components/ui/Button/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/Table/table";
import { Badge } from "@/app/components/ui/Badge/badge";
import { Progress } from "@/app/components/ui/Progress/progress";
import { Upload, FileArchive, RefreshCw, Download } from "lucide-react";
import { toast } from "sonner";

const mockJobs = [
  { id: 1, fileName: "batch_001.zip", type: "Image", total: 150, completed: 150, failed: 0, status: "completed" },
  { id: 2, fileName: "video_batch_alpha.zip", type: "Video", total: 50, completed: 35, failed: 2, status: "processing" },
  { id: 3, fileName: "mixed_content.zip", type: "Mixed", total: 200, completed: 180, failed: 5, status: "processing" },
  { id: 4, fileName: "product_images.zip", type: "Image", total: 80, completed: 80, failed: 0, status: "completed" },
];

export function BulkGenerationPage() {
  const [jobs, setJobs] = useState(mockJobs);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUpload = () => {
    toast.success("File upload started");
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        toast.success("Upload completed!");
        setUploadProgress(0);
      }
    }, 300);
  };

  const handleRetry = (jobId) => {
    toast.info("Retrying failed items...");
  };

  const handleRetryAll = () => {
    toast.info("Retrying all failed items...");
  };

  const getProgress = (job) => {
    return ((job.completed + job.failed) / job.total) * 100;
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Bulk Generation</h1>
        <p className="text-muted-foreground">Upload and process multiple files at once</p>
      </div>

      {/* Upload Zone */}
      <Card className="p-8">
        <div className="border-2 border-dashed border-border rounded-xl p-12 hover:border-primary transition-colors cursor-pointer">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <FileArchive className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Drop ZIP file here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse your files
              </p>
              <Button onClick={handleUpload}>
                <Upload className="w-4 h-4 mr-2" />
                Select File
              </Button>
            </div>
            {uploadProgress > 0 && (
              <div className="max-w-md mx-auto space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Bulk Retry Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Batch Jobs</h2>
        <Button onClick={handleRetryAll} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry All Failed
        </Button>
      </div>

      {/* Jobs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead>Failed</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.fileName}</TableCell>
                <TableCell>
                  <Badge variant="outline">{job.type}</Badge>
                </TableCell>
                <TableCell>{job.total}</TableCell>
                <TableCell className="text-green-600">{job.completed}</TableCell>
                <TableCell className={job.failed > 0 ? "text-red-600" : "text-muted-foreground"}>
                  {job.failed}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={getProgress(job)} className="w-24" />
                    <span className="text-sm text-muted-foreground">{getProgress(job).toFixed(0)}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={job.status === "completed" ? "default" : "secondary"}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {job.failed > 0 && (
                      <Button size="sm" variant="outline" onClick={() => handleRetry(job.id)}>
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    )}
                    {job.status === "completed" && (
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}














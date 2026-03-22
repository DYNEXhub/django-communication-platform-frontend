/**
 * Pipeline list page
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePipelines, useCreatePipeline } from "@/lib/api/hooks/usePipelines";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, TrendingUp, Layers } from "lucide-react";

export default function PipelinesPage() {
  const router = useRouter();
  const { pipelines, loading, error, refetch } = usePipelines();
  const { createPipeline, loading: isCreating } = useCreatePipeline();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPipeline, setNewPipeline] = useState({ name: "", description: "" });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading pipelines...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">Error: {error.message}</div>
      </div>
    );
  }

  const handleCreatePipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createPipeline(newPipeline);
    if (result) {
      setShowCreateDialog(false);
      setNewPipeline({ name: "", description: "" });
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pipelines</h1>
          <p className="text-muted-foreground">
            Manage your sales pipelines and deals
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 size-4" />
          Create Pipeline
        </Button>
      </div>

      {/* Pipeline Cards */}
      {pipelines.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layers className="size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pipelines yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first pipeline to start managing deals
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 size-4" />
              Create Pipeline
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pipelines.map((pipeline) => (
            <Card
              key={pipeline.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/pipelines/${pipeline.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{pipeline.name}</CardTitle>
                  <Badge variant={pipeline.is_active ? "default" : "secondary"}>
                    {pipeline.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {pipeline.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {pipeline.description}
                  </p>
                )}
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Layers className="size-4" />
                      Stages
                    </span>
                    <span className="font-medium">-</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="size-4" />
                      Deals
                    </span>
                    <span className="font-medium">-</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Pipeline Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Pipeline</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePipeline} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pipeline-name">Name *</Label>
              <Input
                id="pipeline-name"
                value={newPipeline.name}
                onChange={(e) => setNewPipeline((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Sales Pipeline"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pipeline-description">Description</Label>
              <Input
                id="pipeline-description"
                value={newPipeline.description}
                onChange={(e) => setNewPipeline((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe this pipeline"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Pipeline"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

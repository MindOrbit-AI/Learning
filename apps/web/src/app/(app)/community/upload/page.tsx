"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from "@mindorbit/ui";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(["note", "summary", "flashcard_set", "diagram", "walkthrough"]),
  subjectId: z.string().min(1),
  clusterId: z.string().min(1),
  nodeId: z.string().min(1),
  content: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function UploadPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Array<{ id: string; title: string }>>([]);
  const [clusters, setClusters] = useState<Array<{ id: string; title: string }>>([]);
  const [nodes, setNodes] = useState<Array<{ id: string; title: string }>>([]);

  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "note" },
  });

  const subjectId = watch("subjectId");
  const clusterId = watch("clusterId");

  useEffect(() => {
    fetch("/api/subjects").then(async (r) => {
      const d = await r.json();
      setSubjects(d.subjects ?? []);
    });
  }, []);

  useEffect(() => {
    if (!subjectId) return;
    fetch(`/api/subjects/${subjectId}/clusters`).then(async (r) => {
      const d = await r.json();
      setClusters(d.clusters ?? []);
      setValue("clusterId", "");
      setValue("nodeId", "");
    });
  }, [subjectId, setValue]);

  useEffect(() => {
    if (!clusterId) return;
    fetch(`/api/clusters/${clusterId}/nodes`).then(async (r) => {
      const d = await r.json();
      setNodes(d.nodes ?? []);
      setValue("nodeId", "");
    });
  }, [clusterId, setValue]);

  async function onSubmit(data: FormData) {
    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        contentJson: JSON.stringify({ markdown: data.content }),
      }),
    });
    if (!res.ok) {
      alert("Upload failed");
      return;
    }
    const result = await res.json();
    router.push(`/community/${result.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Upload Resource</h1>

      <Card>
        <CardHeader>
          <CardTitle>New resource</CardTitle>
          <CardDescription>
            Link your study material to a concept for the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Title</label>
              <Input {...register("title")} placeholder="Resource title" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Description</label>
              <Input {...register("description")} placeholder="Short description" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Type</label>
              <select
                {...register("type")}
                className="w-full rounded-xl border px-3 py-2"
              >
                <option value="note">Note</option>
                <option value="summary">Summary</option>
                <option value="flashcard_set">Flashcards</option>
                <option value="diagram">Diagram</option>
                <option value="walkthrough">Walkthrough</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Subject</label>
              <select
                {...register("subjectId")}
                className="w-full rounded-xl border px-3 py-2"
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Cluster</label>
              <select
                {...register("clusterId")}
                className="w-full rounded-xl border px-3 py-2"
                disabled={!subjectId}
              >
                <option value="">Select cluster</option>
                {clusters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Concept Node</label>
              <select
                {...register("nodeId")}
                className="w-full rounded-xl border px-3 py-2"
                disabled={!clusterId}
              >
                <option value="">Select concept</option>
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Content</label>
              <textarea
                {...register("content")}
                className="w-full rounded-xl border p-4 min-h-[200px]"
                placeholder="Your study content..."
              />
            </div>
            <Button type="submit">Upload</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LessonMode, Subject } from "@/db/schema";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { subjectLabels, weekdays } from "@/lib/constants";

type LessonDialogProps = {
  studentId: string;
  onCreated?: () => void;
};

const subjects = Object.keys(subjectLabels) as Subject[];

export function LessonDialog({ studentId, onCreated }: LessonDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const payload = {
      studentId,
      dayOfWeek: Number(formData.get("dayOfWeek")),
      subject: formData.get("subject"),
      title: formData.get("title"),
      location: formData.get("location"),
      mode: formData.get("mode") as LessonMode,
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime")
    };

    const response = await fetch("/api/lessons", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });

    setPending(false);
    if (response.ok) {
      setOpen(false);
      router.refresh();
      onCreated?.();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          수업 등록
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>수업 일정 등록</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>요일</Label>
              <Select name="dayOfWeek" defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="요일" />
                </SelectTrigger>
                <SelectContent>
                  {weekdays.map((day, index) => (
                    <SelectItem key={day} value={String(index + 1)}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>과목</Label>
              <Select name="subject" defaultValue="MATH">
                <SelectTrigger>
                  <SelectValue placeholder="과목" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subjectLabels[subject]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">수업 제목</Label>
            <Input id="title" name="title" placeholder="예: 수학 심화" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">위치</Label>
            <Input id="location" name="location" placeholder="예: A룸, Zoom" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="startTime">시작</Label>
              <Input id="startTime" name="startTime" type="time" defaultValue="18:00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">종료</Label>
              <Input id="endTime" name="endTime" type="time" defaultValue="20:00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>방식</Label>
            <Select name="mode" defaultValue="ONLINE">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONLINE">온라인</SelectItem>
                <SelectItem value="OFFLINE">오프라인</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button disabled={pending}>{pending ? "저장 중" : "저장"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

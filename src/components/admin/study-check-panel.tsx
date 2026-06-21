"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Subject } from "@/db/schema";
import { Lock, LockOpen, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { subjectLabels } from "@/lib/constants";
import type { LessonView } from "@/types/schedule";

type StudyCheckPanelProps = {
  studentId: string;
  lessons: LessonView[];
  activeStudy: {
    subject: Subject;
    content: string;
    seatLabel: string | null;
  } | null;
};

const subjects = Object.keys(subjectLabels) as Subject[];

export function StudyCheckPanel({
  studentId,
  lessons,
  activeStudy
}: StudyCheckPanelProps) {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [pending, setPending] = useState(false);
  const hasSchedule = lessons.length > 0;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    await fetch("/api/study-sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        studentId,
        subject: formData.get("subject"),
        content: formData.get("content"),
        seatLabel: formData.get("seatLabel")
      })
    });
    setPending(false);
    router.refresh();
  }

  return (
    <div className="space-y-3 rounded-md bg-white/45 p-3">
      <div className="flex items-center justify-between gap-2">
        <Badge>{activeStudy ? "학습 중" : "대기"}</Badge>
        {hasSchedule ? (
          <Button
            variant="glass"
            size="sm"
            onClick={() => setUnlocked((value) => !value)}
          >
            {unlocked ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {unlocked ? "수정 가능" : "잠금"}
          </Button>
        ) : null}
      </div>

      {activeStudy ? (
        <p className="text-sm text-muted-foreground">
          {subjectLabels[activeStudy.subject]} · {activeStudy.content}
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label>과목</Label>
            <Select name="subject" defaultValue="MATH" disabled={hasSchedule && !unlocked}>
              <SelectTrigger>
                <SelectValue />
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
          <div className="space-y-1">
            <Label htmlFor={`${studentId}-seat`}>좌석</Label>
            <Input
              id={`${studentId}-seat`}
              name="seatLabel"
              placeholder="B-12"
              disabled={hasSchedule && !unlocked}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`${studentId}-content`}>학습 내용</Label>
          <Input
            id={`${studentId}-content`}
            name="content"
            placeholder="학습 내용을 입력"
            disabled={hasSchedule && !unlocked}
            required
          />
        </div>
        <Button disabled={pending || (hasSchedule && !unlocked)} size="sm">
          <PlayCircle className="h-4 w-4" />
          {pending ? "기록 중" : "현재 학습 체크"}
        </Button>
      </form>
    </div>
  );
}

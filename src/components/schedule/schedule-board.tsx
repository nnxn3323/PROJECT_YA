"use client";

import { useMemo, useState } from "react";
import { CalendarClock, MapPin, MonitorSmartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subjectLabels, timetableHours, weekdays } from "@/lib/constants";
import type { LessonView } from "@/types/schedule";
import { LessonDialog } from "./lesson-dialog";

type ScheduleBoardProps = {
  studentId: string;
  lessons: LessonView[];
  editable?: boolean;
};

function timeToMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

export function ScheduleBoard({ studentId, lessons, editable = true }: ScheduleBoardProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [version, setVersion] = useState(0);

  const byDay = useMemo(
    () =>
      lessons
        .filter((lesson) => lesson.dayOfWeek === selectedDay)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)),
    [lessons, selectedDay]
  );

  return (
    <div className="space-y-4" key={version}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-7 gap-1 rounded-lg bg-white/35 p-1 backdrop-blur-xl">
          {weekdays.map((day, index) => (
            <button
              key={day}
              onClick={() => setSelectedDay(index + 1)}
              className={`h-10 rounded-md text-sm font-semibold transition-colors ${
                selectedDay === index + 1 ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        {editable ? (
          <LessonDialog studentId={studentId} onCreated={() => setVersion(version + 1)} />
        ) : null}
      </div>

      <Tabs defaultValue="carousel">
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="carousel">
            카드
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="table">
            표
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carousel">
          <div className="relative overflow-hidden rounded-lg border border-white/40 bg-white/20 p-4 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.5),transparent,rgba(255,255,255,.5))]" />
            <div className="flex snap-x gap-3 overflow-x-auto pb-2">
              {timetableHours.map((hour) => {
                const hourLessons = byDay.filter(
                  (lesson) =>
                    timeToMinutes(lesson.startTime) < (hour + 1) * 60 &&
                    timeToMinutes(lesson.endTime) > hour * 60
                );
                return (
                  <Card
                    key={hour}
                    className="min-h-44 min-w-[76vw] snap-center sm:min-w-[21rem]"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{String(hour).padStart(2, "0")}:00</span>
                        <CalendarClock className="h-4 w-4" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {hourLessons.length ? (
                        hourLessons.map((lesson) => (
                          <div key={lesson.id} className="rounded-md bg-white/55 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <strong className="text-sm">{lesson.title}</strong>
                              <Badge>{subjectLabels[lesson.subject]}</Badge>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {lesson.startTime} - {lesson.endTime}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span className="inline-flex items-center gap-1">
                                <MonitorSmartphone className="h-3.5 w-3.5" />
                                {lesson.mode === "ONLINE" ? "온라인" : "오프라인"}
                              </span>
                              {lesson.location ? (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {lesson.location}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">등록된 일정 없음</p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="table">
          <div className="overflow-hidden rounded-lg border border-white/45 bg-white/45 backdrop-blur-2xl">
            {timetableHours.map((hour) => {
              const hourLessons = byDay.filter(
                (lesson) =>
                  timeToMinutes(lesson.startTime) < (hour + 1) * 60 &&
                  timeToMinutes(lesson.endTime) > hour * 60
              );
              return (
                <div key={hour} className="grid grid-cols-[4.5rem_1fr] border-b border-white/45 last:border-b-0">
                  <div className="bg-white/35 p-3 text-sm font-semibold">
                    {String(hour).padStart(2, "0")}:00
                  </div>
                  <div className="min-h-16 p-3">
                    {hourLessons.map((lesson) => (
                      <div key={lesson.id} className="mb-2 rounded-md bg-white/70 p-3 last:mb-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge>{subjectLabels[lesson.subject]}</Badge>
                          <span className="text-sm font-semibold">{lesson.title}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {lesson.startTime} - {lesson.endTime} ·{" "}
                          {lesson.mode === "ONLINE" ? "온라인" : "오프라인"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

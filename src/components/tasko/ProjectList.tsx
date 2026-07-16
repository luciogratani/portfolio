"use client";

// Port di components/dashboard/project-list.tsx.
import { Card } from "@/components/tasko/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/tasko/ui/button";

const projects = [
  { name: "Develop API Endpoints", date: "Nov 26, 2024", color: "bg-blue-500", icon: "⚡" },
  { name: "Onboarding Flow", date: "Nov 28, 2024", color: "bg-cyan-500", icon: "🌊" },
  { name: "Build Dashboard", date: "Nov 30, 2024", color: "bg-emerald-500", icon: "🎨" },
  { name: "Optimize Page Load", date: "Dec 5, 2024", color: "bg-amber-500", icon: "⚡" },
  { name: "Cross-Browser Testing", date: "Dec 6, 2024", color: "bg-purple-500", icon: "🔍" },
];

export function ProjectList() {
  return (
    <Card
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up"
      style={{ animationDelay: "700ms" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-tasko-foreground">Project</h2>
        <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 bg-transparent">
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
      </div>
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.name}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-tasko-secondary transition-all duration-300 cursor-pointer group"
          >
            <div
              className={`${project.color} w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12`}
            >
              {project.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-tasko-foreground text-sm">{project.name}</p>
              <p className="text-xs text-tasko-muted-foreground">Due date: {project.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

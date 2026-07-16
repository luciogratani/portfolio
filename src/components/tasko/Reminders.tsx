"use client";

// Port di components/dashboard/reminders.tsx.
import { Card } from "@/components/tasko/ui/card";
import { Button } from "@/components/tasko/ui/button";
import { Video } from "lucide-react";

export function Reminders() {
  return (
    <Card
      className="p-6 transition-all duration-500 hover:shadow-xl animate-slide-in-up"
      style={{ animationDelay: "500ms" }}
    >
      <h2 className="text-xl font-semibold text-tasko-foreground mb-6">Reminders</h2>
      <div className="space-y-4">
        <div className="bg-tasko-card border border-tasko-border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <h3 className="font-semibold text-tasko-foreground mb-1">Meeting with Arc Company</h3>
          <p className="text-sm text-tasko-muted-foreground mb-4">Time : 02.00 pm - 04.00 pm</p>
          <Button className="w-full bg-tasko-primary text-tasko-primary-foreground hover:bg-tasko-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-tasko-primary/30">
            <Video className="w-4 h-4 mr-2" />
            Start Meeting
          </Button>
        </div>
      </div>
    </Card>
  );
}

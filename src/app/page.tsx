// app/page.tsx
"use client"

import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div>
      <h1>Hi</h1>
      <Button onClick={() => console.log("clicked")}>
        Click Button
      </Button>
    </div>
  );
}
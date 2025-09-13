import React from "react"

import { Grading } from "@/components/grading"

const Grade = () => {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Grade your students&apos; assignments quickly with MyTA! (v2)
        </h1>
      </div>
      <div className="flex gap-4">
        <Grading />
      </div>
    </section>
  )
}

export default Grade

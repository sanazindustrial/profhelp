import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { DiscussionResponse } from "@/components/discussion-response"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Answer every student&apos;s discussion posts quickly with MyTA!
        </h1>
      </div>
      <div className="flex gap-4">
        <DiscussionResponse />
      </div>
    </section>
  )
}

"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Button, DropdownMenu, Link } from "@radix-ui/themes"
import classnames from "classnames"

import { DropDownItem, NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface MainNavProps {
  items: (NavItem | DropDownItem)[]
}

export function MainNav({ items }: MainNavProps) {
  const currentPath = usePathname()
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="inline-block font-bold text-slate-200">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map((item, index) => {
            if (item.type === "link") {
              return (
                <Link
                  key={index}
                  href={item.href!}
                  className={classnames({
                    "text-slate-100 font-semibold": item.href === currentPath,
                    "text-slate-200": item.href !== currentPath,
                    "hover:text-slate-50   transition-colors": true,
                  })}
                >
                  {item.title}
                </Link>
              )
            }

            if (item.type === "dropdown") {
              return (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button
                      variant="soft"
                      className=" cursor-pointer text-slate-200 "
                    >
                      {item.title}
                      <DropdownMenu.TriggerIcon />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {item.elements!.map((element) => (
                      <DropdownMenu.Item key={element.title}>
                        <Link
                          href={element.href}
                          className="hover:text-slate-50"
                        >
                          {element.title}
                        </Link>
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              )
            }
          })}
        </nav>
      ) : null}
    </div>
  )
}

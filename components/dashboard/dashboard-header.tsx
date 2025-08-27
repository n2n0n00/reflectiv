"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";

export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">
                M
              </span>
            </div>
            <span className="font-serif font-bold text-xl text-foreground">
              MindfulPath
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Dashboard
            </Link>
            {/* <Link
              href="/journal"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Journal
            </Link> */}
            <Link
              href="/insights"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Insights
            </Link>
            <Link
              href="/templates"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Templates
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* {user.trialDaysLeft > 0 && (
            <Badge
              variant="secondary"
              className="bg-accent text-accent-foreground"
            >
              {user.trialDaysLeft} days left in trial
            </Badge>
          )} */}

          {/* <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Start Journaling
          </Button> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={"/generic-user-avatar.png"}
                    alt={user?.user_metadata.full_name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.user_metadata.full_name
                      .split(" ")
                      .map((n: any) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata.full_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.user_metadata.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/billing">Billing & Plan</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/export">Export Data</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

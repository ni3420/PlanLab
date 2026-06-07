"use client";

import { LogOut, User, Mail, ShieldAlert, Loader2 } from "lucide-react";
import { useCurrentUser } from "@/features/auth/api/use-currentuser";
import { useLogout } from "@/features/auth/api/use-logout";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserButton() {
  const { data: user, isLoading } = useCurrentUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  if (isLoading) {
    return (
      <div className="h-9 w-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border border-neutral-200 dark:border-neutral-700">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-9 w-9 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center border border-red-200 dark:border-red-900/30 text-red-500" title="Session unauthenticated">
        <ShieldAlert className="h-4 w-4" />
      </div>
    );
  }

  const name = user.name || "User Node";
  const email = user.email || "No email verified";
  const fallbackAvatarLetter = name.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative group">
        <Avatar className="h-9 w-9 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors shadow-sm">
          <AvatarFallback className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-bold text-xs uppercase tracking-tight">
            {fallbackAvatarLetter}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        side="bottom" 
        sideOffset={8}
        className="w-60 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-1.5 rounded-xl shadow-md text-xs"
      >
        <div className="flex items-center gap-2.5 p-2 bg-neutral-50/50 dark:bg-neutral-950/30 rounded-lg border border-neutral-100/50 dark:border-neutral-800/30 mb-1">
          <Avatar className="h-8 w-8 border border-neutral-200/60 dark:border-neutral-800/60 shrink-0">
            <AvatarFallback className="bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 font-bold text-[11px] uppercase">
              {fallbackAvatarLetter}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate flex items-center gap-1">
              <User className="h-3 w-3 stroke-[2.5] text-neutral-400 shrink-0" />
              {name}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate font-medium mt-0.5 flex items-center gap-1">
              <Mail className="h-3 w-3 text-neutral-400/80 shrink-0" />
              {email}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-neutral-100 dark:bg-neutral-800/60 my-1" />

        <DropdownMenuItem 
          disabled={isLoggingOut}
          onClick={() => logout()}
          className="flex items-center gap-2 px-2.5 py-2 text-red-600 dark:text-red-400 focus:bg-red-50/50 dark:focus:bg-red-950/20 focus:text-red-600 dark:focus:text-red-400 rounded-lg cursor-pointer font-medium transition-colors"
        >
          {isLoggingOut ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogOut className="h-3.5 w-3.5 stroke-[2]" />
          )}
          <span>Close Session Logs</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
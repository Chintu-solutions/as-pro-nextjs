"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ForgetPass() {
  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="h-auto p-0 text-sm text-muted-foreground hover:text-primary hover:no-underline"
        >
          Forgot password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[450px] p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reset Password
          </DialogTitle>
          <DialogDescription className="text-base">
            You will be redirected to our password reset page.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-3">
          <Button
            onClick={() => router.push("/forget")}
            className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Continue to Reset Password
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 text-base"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

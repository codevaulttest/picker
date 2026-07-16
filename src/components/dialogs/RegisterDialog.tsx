import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { registerUser } from "@/lib/mockBackend";
import { BRAND, TEXT } from "@/config/app.config";

interface Props {
  open: boolean;
  onSuccess: (user: any) => void;
}

export default function RegisterDialog({ open, onSuccess }: Props) {
  const [name, setName] = useState("");

  const registerMutation = useMutation({
    mutationFn: (vars: { name: string }) => registerUser(vars.name),
    onSuccess: (data) => onSuccess(data),
  });

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-sm border-0 shadow-2xl rounded-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="flex flex-col items-center gap-3">
            <img src={BRAND.logo} alt={BRAND.name} className="w-16 h-16 rounded-2xl" />
            <DialogTitle className="text-lg font-semibold">{TEXT.home.welcomeTitle}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-slate-500 text-center">{TEXT.home.welcomeDesc}</p>
          <input
            type="text"
            placeholder="请输入昵称"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            onKeyDown={(e) => e.key === "Enter" && name.trim() && registerMutation.mutate({ name: name.trim() })}
          />
          <Button
            className="w-full h-11 rounded-xl font-medium transition-all"
            style={{ background: `linear-gradient(135deg, ${BRAND.name ? "#3B82F6" : ""}, #8B5CF6)` }}
            onClick={() => name.trim() && registerMutation.mutate({ name: name.trim() })}
            disabled={!name.trim() || registerMutation.isPending}
          >
            {registerMutation.isPending ? TEXT.home.creating : TEXT.home.startButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

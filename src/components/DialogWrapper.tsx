import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface DialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({
  open,
  onOpenChange,
  title,
  children,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 grid place-items-center overflow-y-auto bg-black bg-opacity-50">
          <Dialog.Content className="max-h-[80vh] min-w-[300px] overflow-auto rounded-md bg-white px-8 pb-8">
            <div className="sticky top-0 flex items-center justify-between gap-2 bg-white pb-2 pt-8">
              <h2 className="fond-medium text-lg">{title}</h2>
              <Dialog.Close className="button-outline button-sm">
                <X className="icon" />
                Cerrar
              </Dialog.Close>
            </div>
            {children}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogWrapper;

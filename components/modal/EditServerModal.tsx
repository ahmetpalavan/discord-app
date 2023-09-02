"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formSchema } from "@/schemas/form/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FileUpload from "../FileUpload";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useModalStore } from "@/hooks/use-modal-store";
import { ServerWithMembers } from "@/types";
import { useEffect } from "react";

type Props = {};

type Input = z.infer<typeof formSchema>;

const EditServerModal = (props: Props) => {
  const { onOpen, onClose, type, isModalOpen, data } = useModalStore();

  const openModal = isModalOpen && type === "editServer" && !!data;

  const { server } = data as { server: ServerWithMembers };

  const form = useForm<Input>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      name: "",
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name);
      form.setValue("imageUrl", server.imageUrl);
    }
  }, [server, form]);

  const router = useRouter();

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (openModal && server) {
      form.setValue("imageUrl", server.imageUrl);
      form.setValue("name", server.name);
    }
  }, [openModal, server, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server.id}`, values);
      form.reset();
      router.refresh();
      onClose();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={openModal} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">Customize your experience</DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 text-center">Choose your language and location settings</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload endpoint="serverImage" onChange={field.onChange} value={field.value} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="default" disabled={isLoading}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;

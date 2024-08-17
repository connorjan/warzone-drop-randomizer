import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Settings } from "lucide-react"
import { SettingsSchema } from "@/components/settings"

// import { ServerFormHandler } from "./server-form-handler"

export function SettingsDialog({onSubmit, options}) {
  const [open, setOpen] = React.useState(false)

  // Equal to Tailwind's "md" breakpoint
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const title = "Settings"
  const desc  = `Make changes to the settings here. ${isDesktop ? "Click" : "Tap"} save when you're done.`

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="w-3/5 h-3/5"/>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[70dvh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{desc}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="overflow-y-auto">
            <ProfileForm onSubmit={onSubmit} setOpen={setOpen} options={options} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="w-3/5 h-3/5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">
          <ProfileForm onSubmit={onSubmit} setOpen={setOpen} options={options} className="px-4" />
          <DrawerFooter className="pt-2">
            {/* <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose> */}
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

function ProfileForm({ className, onSubmit, setOpen, options }) {

  const [pending, setPending] = React.useState(false)

  async function onSubmitWrapper(formData) {
    // setPending(true)
    // const result = await ServerFormHandler(formData)
    // setPending(false)
    // console.log(result)
    onSubmit(formData)
    setOpen(false)
  }

  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: options
  })

  return (
    <Form {...form}>
      <form action={form.handleSubmit(onSubmitWrapper)} className={cn("space-y-4 py-1", className)}>

        <FormField
          control={form.control}
          name="johnMode"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel className="min-w-40">John Mode</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="showAnimation"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel className="min-w-40">Show Animation</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending} variant="outline" className="w-full md:w-auto md:min-w-[8em]">
          {!pending && "Save"}
          { pending && "Saving..."}
        </Button>
      </form>
    </Form>
  )
}

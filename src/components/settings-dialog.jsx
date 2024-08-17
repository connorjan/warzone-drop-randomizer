import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Settings } from "lucide-react"
import { SettingsSchema } from "@/components/settings"
import { DefaultSettings } from "@/components/settings"

// import { ServerFormHandler } from "./server-form-handler"

export function SettingsDialog({onSubmit, options}) {
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  // Need to maintain the resetDialog state here so it doesn't get removed on re-render when the breakpoint changes
  const [resetOpen, setResetOpen] = React.useState(false)

  // Equal to Tailwind's "md" breakpoint
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const title = "Settings"
  const desc  = `Make changes to the settings here. ${isDesktop ? "Click" : "Tap"} save when you're done.`

  const settingsFormProps = {
    onSubmit: onSubmit,
    setSettingsOpen: setSettingsOpen,
    isDesktop: isDesktop,
    options: options,
    resetOpen: resetOpen,
    setResetOpen: setResetOpen,
  }

  if (isDesktop) {
    return (
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
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
          <ScrollArea className="overflow-y-auto" scrollHideDelay="0">
            <SettingsForm {...settingsFormProps} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
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
          <SettingsForm {...settingsFormProps} className="px-4" />
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

function FormSwitch({form, name, label}) {
  return <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center gap-4">
          <FormLabel className="min-w-40">{label}</FormLabel>
          <div className="grow"/>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </div>
        <FormMessage />
      </FormItem>
    )}
  />
}

function ResetButton(props) {

  return (
    <Dialog {...props}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto md:min-w-[8em]">Reset to Defaults</Button>
      </DialogTrigger>
      <DialogContent className="w-[90%] overflow-hidden flex flex-col rounded-lg">
        <DialogHeader className="text-left sm:text-left">
          <DialogTitle>Confirm Changes</DialogTitle>
          <DialogDescription>Are you sure you want to reset settings to their default values?</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-2">
          <DialogClose asChild>
            <Button onClick={props.onReset} variant="destructive" className="w-full md:w-auto md:min-w-[8em]">Yes</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline" className="w-full md:w-auto md:min-w-[8em]">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SettingsForm({ className, ...props }) {

  const [pending, setPending] = React.useState(false)

  async function onSubmitWrapper(formData) {
    // setPending(true)
    // const result = await ServerFormHandler(formData)
    // setPending(false)
    // console.log(result)
    props.onSubmit(formData)
    props.setSettingsOpen(false)
  }

  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: props.options
  })

  const switches = [
    {
      name: "johnMode",
      label: "John Mode"
    },
    {
      name: "showAnimation",
      label: "Show Animation"
    }
  ]

  return (
    <Form {...form}>
      <form action={form.handleSubmit(onSubmitWrapper)} className={cn("space-y-4 py-1", className)}>
        <FormLabel className="text-lg">Switches</FormLabel>
        <Card>
          <CardContent className="p-2">
            <div className="space-y-2">
              {switches.map((item, index) => (
                <>
                  <FormSwitch form={form} name={item.name} label={item.label}/>
                  {index < switches.length-1 && <Separator/>}
                </>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-y-2 md:flex-row">
          <Button type="submit" disabled={pending} className="w-full md:w-auto md:min-w-[8em]">
            {pending ? "Saving" : "Save"}
          </Button>
          {props.isDesktop && <div className="grow"/>}
          <ResetButton onReset={() => onSubmitWrapper(DefaultSettings)} open={props.resetOpen} onOpenChange={props.setResetOpen} />
        </div>
      </form>
    </Form>
  )
}

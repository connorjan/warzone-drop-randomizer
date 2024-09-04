import { useState, Fragment } from 'react'

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from '@/components/ui/label'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Settings as SettingsIcon } from "lucide-react"
import { Settings, SwitchLabels } from "@/components/settings"
import { MapData } from './map-data'

export function SettingsDialog({onSubmit, options}) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Need to maintain the resetDialog state here so it doesn't get removed on re-render when the breakpoint changes
  const [resetOpen, setResetOpen] = useState(false)

  // Equal to Tailwind's "md" breakpoint
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const title = "Settings"
  const desc  = `Make changes to the settings here. ${isDesktop ? "Click" : "Tap"} save when you're done.`

  const settingsProps = {
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
            <SettingsIcon className="w-3/5 h-3/5"/>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[70dvh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{desc}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="overflow-y-auto" scrollHideDelay="0">
            <SettingsForm {...settingsProps} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={settingsOpen} onOpenChange={setSettingsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon className="w-3/5 h-3/5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{desc}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">
          <SettingsForm {...settingsProps} className="px-4" />
          <DrawerFooter className="pt-2">
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

function FormSwitch({label, value, onChange}) {
  return (
    <div className="flex items-center gap-4">
      <Label className="min-w-40">{label}</Label>
      <div className="grow"/>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  )
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

  const [pending, setPending] = useState(false)

  const [switchStates, setSwitchStates] = useState((() => {
    // Build default switch values using the keys based off of the default settings, but override values based on local storage
    let defaults = {}
    Object.entries(Settings.switches).forEach(([key, settingsDefault]) => {
      let defaultValue = settingsDefault
      if (key in props.options.switches) {
        // If the key already exists in the localStorage use that value as the default instead
        defaultValue = props.options.switches[key]
      }
      defaults[key] = defaultValue
    })
    return defaults
  })())

  const [enabledLocations, setEnabledLocations] = useState((() => {
    // Build default switch values using the keys based off of the default settings, but override values based on local storage
    let defaults = {}
    MapData.forEach((map) => {
      defaults[map.name] = {}
      map.locations.forEach((location) => {
        defaults[map.name][location] = true
        if (props.options.disabledLocations.hasOwnProperty(map.name) && props.options.disabledLocations[map.name].includes(location)) {
          defaults[map.name][location] = false
        }
      })
    })

    return defaults
  })())

  const onSwitch = (key, newValue) => {
    let newSwitchStates = structuredClone(switchStates)
    newSwitchStates[key] = newValue

    // Special case overrides
    if (key == "johnMode" && newValue) {
      newSwitchStates["ianMode"] = false
    }

    if (key == "ianMode" && newValue) {
      newSwitchStates["johnMode"] = false
    }

    setSwitchStates(newSwitchStates)
  }

  async function onSubmitWrapper(reset=false) {
    // setPending(true)
    // const result = await ServerFormHandler(formData)
    // setPending(false)

    let newOptions
    if (reset) {
      newOptions = structuredClone(Settings)
    } else {
      // Extract switches
      newOptions = structuredClone(props.options)
      Object.entries(switchStates).forEach(([key, value]) => {
        newOptions.switches[key] = value
      })

      // Extract disabledLocations
      Object.entries(enabledLocations).forEach(([map, locations]) => {
        newOptions.disabledLocations[map] = []
        Object.entries(locations).forEach(([location, enabled]) => {
          if (!enabled) {
            newOptions.disabledLocations[map].push(location)
          }
        })
        if (newOptions.disabledLocations[map].length == 0) {
          delete newOptions.disabledLocations[map]
        }
      })
    }

    props.onSubmit(newOptions)
    props.setSettingsOpen(false)
  }

  return (
    <div className={cn("space-y-4", className)}>

    {/* Switches */}
    <Card>
      <CardContent className="p-2">
        <div className="space-y-2">
          {Object.entries(switchStates).map(([key, value], index) => (
            <Fragment key={key}>
              <FormSwitch label={SwitchLabels[key]} value={value} onChange={(value) => onSwitch(key, value)} />
              {index < Object.keys(switchStates).length-1 && <Separator/>}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>

      {/* Custom location settings */}
      <div className="text-lg font-semibold">Customize Locations</div>

      <Accordion type="single" collapsible className="w-full pt-0 mt-0">
        {MapData.map((map, mapIndex) => (
          <Fragment key={`accordian-item-${mapIndex}`}>
            <AccordionItem value={mapIndex+1}>
              <AccordionTrigger>{map.name}</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <ScrollArea className="max-h-40 overflow-y-auto" scrollHideDelay="0">
                    <CardContent className="p-2">
                      <div className="space-y-2">
                        {Object.entries(enabledLocations[map.name]).map(([location, disabled], locationIndex) => (
                          <Fragment key={`dis-switch-${mapIndex}-${locationIndex}`}>
                            <FormSwitch label={location} value={disabled} onChange={(value) => {
                                let newVal = structuredClone(enabledLocations)
                                newVal[map.name][location] = value
                                setEnabledLocations(newVal)
                              }}
                            />
                            {/* {locationIndex < Object.keys(enabledLocations[map.name]).length-1 && <Separator/>} */}
                          </Fragment>
                        ))}
                      </div>
                    </CardContent>
                  </ScrollArea>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Fragment>
        ))}
      </Accordion>

      {/* Save and Reset buttons */}
      <div className="flex flex-col gap-y-2 md:flex-row p-1">
        <Button onClick={() => onSubmitWrapper(false)} disabled={pending} className="w-full md:w-auto md:min-w-[8em]">
          {pending ? "Saving" : "Save"}
        </Button>
        {props.isDesktop && <div className="grow"/>}
        <ResetButton onReset={() => onSubmitWrapper(true)} open={props.resetOpen} onOpenChange={props.setResetOpen} />
      </div>
    </div>
  )
}

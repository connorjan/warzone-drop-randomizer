"use client"

import { useState } from 'react'

// shadcn components
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

// other components
import { ModeToggle } from "@/components/mode-toggle"
import { MapData } from "@/components/map-data"
import { IosPickerItem } from '@/components/ios-picker/ios-picker-item'
import { SettingsDialog } from '@/components/settings-dialog'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { Settings } from '@/components/settings'
import { getRandomInt, shuffle } from '@/lib/common'

export default function App() {

  const sanitizeSettings = (settings) => {
    if (!settings.hasOwnProperty('switches')) {
      return Settings
    }
    return settings
  }

  const [mapData, setMapData] = useState(MapData);
  const [options, setOptions] = useLocalStorage("options", structuredClone(Settings), sanitizeSettings)

  const [activeIndices, setActiveIndices] = useState(mapData.map((map) => (getRandomInt(map.locations.length))))

  const setActiveIndex = (index) => {
    return (value) => {
      let copy = [...activeIndices]
      copy[index] = value
      setActiveIndices(copy)
    }
  };

  const [tab, setTab] = useState(mapData[0].name)

  const onTabChange = (value) => {
    setTab(value);
  }

  async function onSubmitOptions(newOptions) {
    setOptions(newOptions)
  }

  const handleSpecialMode = () => {
    let locations = mapData.filter((items) => (items.name == tab))[0].locations

    try {
      if (options.switches.hasOwnProperty('johnMode') && options.switches.johnMode) {
        switch (tab) {
          case "Vondel": return ["Mall"]
          case "Rebirth Island": return ["Boat"]
          case "Fortune's Keep": return ["Boat"]
        }
      } else if (options.switches.hasOwnProperty('ianMode') && options.switches.ianMode) {
        switch (tab) {
          case "Rebirth Island": return ["Living Quarters"]
        }
      }
    } catch (error) {
      console.log("Error:")
      console.log(error)
    }

    return locations
  };

  const itemsModified = handleSpecialMode();

  return (
    <main className="flex flex-col items-center p-12 font-warzone">

      <h1 className="pb-4 font-extrabold text-center text-4xl md:text-6xl">WARZONE RANDOMIZER</h1>

      <Tabs value={tab} onValueChange={onTabChange} className='w-full max-w-screen-xl'>

        {/* Top bar */}
        <div className="flex gap-x-2">
          <SettingsDialog onSubmit={onSubmitOptions} options={options} />

          {/* Selecter (mobile) */}
          <div className="block md:hidden grow">
            <Select value={tab} onValueChange={onTabChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {mapData.map((map, index) => (
                    <SelectItem value={map.name} key={index}>{map.name}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Tab list (desktop) */}
          <TabsList className="hidden grow md:grid grid-flow-col grid-cols-fit w-full">
            {mapData.map((map, index) => (
              <TabsTrigger value={map.name} key={index} className="max-w-screen-md">{map.name}</TabsTrigger>
            ))}
          </TabsList>

          {/* Theme toggle */}
          <ModeToggle/>
        </div>

        {/* Tab content */}
        {mapData.map((map, index) => (
          <TabsContent value={map.name} key={index}>
            <Card>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="flex flex-col items-center w-full md:max-w-lg">
                    <IosPickerItem
                      items_i={itemsModified}
                      activeIndex={activeIndices[index]}
                      setActiveIndex={setActiveIndex(index)}
                      duration={40}
                      delay={10}
                      options={options}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}

      </Tabs>
    </main>
  );
}

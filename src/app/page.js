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
import { DefaultSettings } from '@/components/settings'

export default function App() {

  // const [mapDataVersion, setMapDataVersion] = useLocalStorage("mapDataVersion", -1);
  const [mapData, setMapData] = useLocalStorage("mapData", MapData);
  const [options, setOptions] = useLocalStorage("options", DefaultSettings)

  const [activeIndices, setActiveIndices] = useState(Array(mapData.length))

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

  async function onSubmitOptions(formData) {
    let copy = {...options}
    copy.johnMode = formData.johnMode
    copy.showAnimation = formData.showAnimation
    setOptions(copy)
  }

  const handleJohnMode = () => {
    const currentLocations = mapData.filter((items) => (items.name == tab))[0].locations

    return !options.johnMode ? currentLocations :
           tab == "Vondel"   ? ["Mall"] :
                               ["Boat"];
  };

  const itemsModified = handleJohnMode();

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

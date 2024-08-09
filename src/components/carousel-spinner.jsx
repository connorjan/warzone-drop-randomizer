"use client"

import { pickRandom } from "@/lib/common";
import { Button } from "@/components/ui/button";
import { IosPickerItem } from '@/components/ui/ios-picker/ios-picker-item'
import { cn } from "@/lib/utils";

export function CarouselSpinner({data, value, setValue, index}) {

    const randomize = () => {
        const currentValue = value[index]
        const filtered = data.filter((item) => item != currentValue)
        const picked = pickRandom(filtered);
        let newValue = [...value]
        newValue[index] = picked
        setValue(newValue)
    };


    if (data.length) {
        return (
            <div className="flex flex-col items-center">
                <Button onClick={randomize} className="w-full md:max-w-md" variant="secondary">Randomize</Button>
                <h1 className="scroll-m-20 pt-12 text-3xl font-semibold tracking-tight first:mt-0 text-center">{value[index]}</h1>
                {/* <div className="embla">
                    <IosPickerItem items={data} loop={true} />
                </div> */}
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center">
                <p className="text-xl">Coming soon ...</p>
            </div>
        )
    }
}

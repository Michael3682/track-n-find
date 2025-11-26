import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
   Card,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
   SheetFooter,
} from "@/components/ui/sheet";

export function CardSheet({searchItem}: {searchItem: string}) {
   const items = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      description:
         "A black leather business bag was turned in to our office earlier today. The bag features a structured rectangular design with silver-toned hardware and a reinforced handle.",
      dateTimeFound: new Date().toLocaleString(),
      location: "Tent",
      status: "UNCLAIMED",
      user: "User",
      img: "vercel.svg",
      link: `/messages`,
   }));

   const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(searchItem.toLowerCase())
   );
   return (
      <div className="flex flex-wrap justify-center gap-10 p-10">
         {filteredItems.map((item) => (
            <Sheet key={item.id}>
               <SheetTrigger className="cursor-pointer p-0" asChild>
                  <Card className="w-70 bg-transparent overflow-hidden border rounded-sm shadow-none hover:shadow-lg hover:border-transparent transition-all duration-100 ease-linear">
                     <CardHeader className="bg-primary-foreground p-5">
                        <CardTitle>
                           <img
                              className="invert aspect-video h-50"
                              src={item.img}
                              alt="image"
                           />
                        </CardTitle>
                     </CardHeader>
                     <CardDescription className="p-5 pt-0 text-xl text-[rgb(20,20,20)]">
                        {item.name}
                     </CardDescription>
                  </Card>
               </SheetTrigger>
               <SheetContent side="center">
                  <SheetHeader className="space-y-5">
                     <img
                        className="invert aspect-video"
                        src={item.img}
                        alt="image"
                     />
                     <div className="space-y-5">
                        <SheetTitle className="text-3xl">
                           {item.name}
                           <p className="text-xs font-light text-muted-foreground">
                              Reported By:{" "}
                              <span className="font-normal">{item.user}</span>
                           </p>
                        </SheetTitle>
                        <div className="space-y-7">
                           <p className="text-lg text-muted-foreground">
                              {item.description}
                           </p>
                           <Separator />
                           <div className="space-y-2">
                              <p className="mt-5 text-base font-medium text-[rgb(20,20,20)] flex justify-between">
                                 Reported on:{" "}
                                 <span className="font-normal">
                                    {item.dateTimeFound}
                                 </span>
                              </p>
                              <p className="text-base font-medium text-[rgb(20,20,20)]  flex justify-between">
                                 Location:{" "}
                                 <span className="font-normal">
                                    {item.location}
                                 </span>
                              </p>
                              <p className="text-base font-medium text-[rgb(20,20,20)]  flex justify-between">
                                 Status:{" "}
                                 <span className="font-semibold text-red-500">
                                    {item.status}
                                 </span>
                              </p>
                           </div>
                        </div>
                     </div>
                  </SheetHeader>
                  <SheetFooter>
                     <Button className="cursor-pointer" type="submit" asChild>
                        <Link href={`${item.link}/${item.id}`}>
                           Message User
                        </Link>
                     </Button>
                  </SheetFooter>
               </SheetContent>
            </Sheet>
         ))}
      </div>
   );
}

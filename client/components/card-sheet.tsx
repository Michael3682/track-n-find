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
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth/AuthContext";
import { findOrCreateConversation } from "@/lib/chatService";

import { Item } from "@/types/types";
import { useRouter } from "next/navigation";

const formattedDate = (date: string | number | Date) => {
  if (!date) return;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const CardSheet = ({ item }: { item: Item }) => {
  const { user } = useAuth();
  const router = useRouter();

  const handleMessageUser = async (item: Item) => {
    if(item.author.id == user?.id) {
      return router.push(`/messages?item=${item.name}`);
    }
      
    const [data] = await findOrCreateConversation({
      itemId: item.id,
      hostId: item.author.id,
      senderId: undefined,
    });

    router.push(`/messages/${data.conversation.id}`);
  };

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer p-0 shadow-muted" asChild>
        <Card className="w-43 lg:w-50 flex-none gap-0 bg-transparent overflow-hidden border rounded-sm hover:border-ring transition-all duration-100 ease-linear">
          <CardHeader className="bg-primary-foreground p-0 gap-0 relative">
            <CardTitle>
              <img
                className="aspect-video h-35 lg:h-50 object-cover object-center z-10"
                src={
                  item?.attachments?.length > 0
                    ? item.attachments[0]
                    : undefined
                }
                alt="image"
              />
              <Badge
                className={`${
                  item.status === "CLAIMED" ? "bg-green-400" : "bg-red-400"
                } z-20 absolute top-0 right-0 rounded-tl-none rounded-tr-none rounded-bl-md rounded-br-none`}
              >
                <small className="text-[8px] lg:text-[10px]">
                  {item.status}
                </small>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardDescription className="p-2 lg:p-4 text-sm font-medium lg:text-base text-primary flex flex-col">
            {item.name}
            <small className="text-[10px] lg:text-xs font-light text-muted-foreground">
              {item.type}
            </small>
          </CardDescription>
        </Card>
      </SheetTrigger>
      <SheetContent className="p-8 lg:p-10" side="center">
        <SheetHeader className="p-0 space-y-3 lg:space-y-5">
          <img
            className="aspect-video object-contain object-top shadow-inner shadow-black/10 rounded-md p-5 drop-shadow-lg drop-shadow-black/50"
            src={
              item?.attachments?.length > 0 ? item.attachments[0] : undefined
            }
            alt="image"
          />
          <div className="space-y-7">
            <SheetTitle className="text-xl lg:text-3xl">
              {item.name}
              <p className="text-xs font-light text-muted-foreground">
                Reported By:{" "}
                <span className="font-normal">{item.author.name}</span>
              </p>
            </SheetTitle>
            <div className="space-y-7">
              <p className="text-base lg:text-lg text-muted-foreground">
                {item.description}
              </p>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                  Reported on:{" "}
                  <span className="font-normal">
                    {formattedDate(item.date_time)}
                  </span>
                </p>
                <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                  Location: <span className="font-normal">{item.location}</span>
                </p>
                <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      item.status === "CLAIMED"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </p>
              </div>
              {item.status == "CLAIMED" && (
                <>
                  <Separator />
                  {item.type == "FOUND" ? (
                    <div>
                      <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                        Claimer's Name:{" "}
                        <span className="font-normal">
                          {item.claims[item.claims.length - 1]?.claimerName}
                        </span>
                      </p>
                      <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                        Course and Section:{" "}
                        <span className="font-normal">
                          {item.claims[item.claims.length - 1]?.yearAndSection}
                        </span>
                      </p>
                      <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                        Contact Number:{" "}
                        <span className="font-normal">
                          {item.claims[item.claims.length - 1]?.contactNumber}
                        </span>
                      </p>
                      <p className="text-xs lg:text-base font-medium text-primary flex justify-between">
                        Proof of claim:{" "}
                        <span
                          className="font-normal underline cursor-pointer"
                          onClick={() =>
                            router.push(
                              item.claims[item.claims.length - 1].proofOfClaim
                            )
                          }
                        >
                          See Proof
                        </span>
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>
        </SheetHeader>
        <SheetFooter className="pb-0 px-0">
          <Button
            className="text-xs lg:text-base py-0 lg:py-5 cursor-pointer"
            type="submit"
            asChild
          >
            {item.associated_person == user?.id ? (
              <div>
                <Link href={`update/${item.id}`}>Manage Item</Link>
              </div>
            ) : item.status != "CLAIMED" ? (
              <p onClick={() => handleMessageUser(item)}>Message User</p>
            ) : null}
          </Button>
          {
            item.associated_person == user?.id &&
            <Button
                className="text-xs lg:text-base py-0 lg:py-5 cursor-pointer bg-transparent border text-inherit hover:bg-gray-200"
                type="submit"
                asChild
            >
                <p onClick={() => handleMessageUser(item)}>See Messages</p>
            </Button>
          }
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CardSheet;

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function MobileAccordion({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="hidden lg:block">{children}</div>
      <div className="block lg:hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Have you met Cloudret?</AccordionTrigger>
            <AccordionContent>{children}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}

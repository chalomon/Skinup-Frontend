"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormMultivende from "@/app/dashboard/configuraciones/defontana/form";
//contexto multivende
import { UseContext } from "@/app/dashboard/configuraciones/defontana/context";
import { useEffect, useState } from "react";

interface IdialogProds {
  title: string,
  textBtn: string,
}

export default function DialogMultiVende({ textBtn, title }: Readonly<IdialogProds>) {
  const [show, setShow] = useState(false);
  const { data } = UseContext();

  useEffect(() => {
    setShow(false);
  }, [data?.updatedAt])

  return (
    <Dialog open={show} onOpenChange={setShow}>
    <DialogTrigger asChild>
      <Button variant="outline">{textBtn}</Button>
    </DialogTrigger>
    <DialogContent className="max-w-[900px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {"Ingrese campos solicitados"}
        </DialogDescription>
      </DialogHeader>
      <FormMultivende textBtn={textBtn} />
    </DialogContent>
  </Dialog>
  )
}
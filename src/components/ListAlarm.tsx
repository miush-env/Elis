import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@components/ui/button";
import { startMusic, stopMusic } from "@/services/sound/playerSound";
import type { Alarm } from "@/types/alarm";

function ListAlarm({ alarms }: { alarms: Alarm[] }) {
  return (
    <Table className="table-fixed">
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Nombre</TableHead>
          <TableHead>Dias</TableHead>
          <TableHead>Hora</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alarms.map((alarm) => (
          <TableRow key={alarm.id}>
            <TableCell className="font-medium">{alarm.name}</TableCell>
            <TableCell>{alarm.days.join(", ")}</TableCell>
            <TableCell>{alarm.time.hour + " " + alarm.time.minute}</TableCell>
            <TableCell
              className="text-right"
              onClick={alarm.isEnable === true ? startMusic : stopMusic}
            >
              <Button>{alarm.isEnable === true ? "Apagar" : "Sonar"}</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ListAlarm;

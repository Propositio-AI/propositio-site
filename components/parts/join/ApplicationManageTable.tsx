import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Application } from "@/lib/types"

type ApplicationsProps = {
  applications: Application[];
}

const ApplicationManageTable = ({ applications }: ApplicationsProps) => {
  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("ja-JP")
  }

  const wrapCellClass = "whitespace-normal break-words align-top"

  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-28 whitespace-normal">日付</TableHead>
          <TableHead className="w-28 whitespace-normal">名前</TableHead>
          <TableHead className="w-48 whitespace-normal">メールアドレス</TableHead>
          <TableHead className="w-40 whitespace-normal">大学学部</TableHead>
          <TableHead className="w-36 whitespace-normal">希望ポジション</TableHead>
          <TableHead className="w-72 whitespace-normal">志望動機</TableHead>
          <TableHead className="w-24 whitespace-normal">状況</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className={`font-medium ${wrapCellClass}`}>{formatDate(application.created_at)}</TableCell>
            <TableCell className={wrapCellClass}>{application.name}</TableCell>
            <TableCell className="whitespace-normal break-all align-top">{application.email}</TableCell>
            <TableCell className={wrapCellClass}>{application.school_info}</TableCell>
            <TableCell className={wrapCellClass}>{application.position}</TableCell>
            <TableCell className={wrapCellClass}>{application.motivation}</TableCell>
            <TableCell className={wrapCellClass}>{application.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ApplicationManageTable

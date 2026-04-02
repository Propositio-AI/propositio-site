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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">日付</TableHead>
          <TableHead>名前</TableHead>
          <TableHead>メールアドレス</TableHead>
          <TableHead>大学学部</TableHead>
          <TableHead>希望ポジション</TableHead>
          <TableHead>志望動機</TableHead>
          <TableHead>状況</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((application) => (
          <TableRow key={application.id}>
            <TableCell className="font-medium">{formatDate(application.created_at)}</TableCell>
            <TableCell>{application.name}</TableCell>
            <TableCell>{application.email}</TableCell>
            <TableCell>{application.school_info}</TableCell>
            <TableCell>{application.position}</TableCell>
            <TableCell>{application.motivation}</TableCell>
            <TableCell>{application.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ApplicationManageTable

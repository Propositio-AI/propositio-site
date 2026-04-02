import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Contact } from "@/lib/types"

type ContactsProps = {
  contacts: Contact[];
  onStatusChange: (id: string, status: string) => Promise<void>;
}

const statusOptions = ["未対応", "対応中", "完了"]

const ContactManageTable = ({ contacts, onStatusChange }: ContactsProps) => {
  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("ja-JP")
  }

  const wrapCellClass = "whitespace-normal break-words align-top"

  return (
    <Table className="w-full table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-28 whitespace-normal">日付</TableHead>
          <TableHead className="w-40 whitespace-normal">件名</TableHead>
          <TableHead className="w-48 whitespace-normal">メールアドレス</TableHead>
          <TableHead className="w-72 whitespace-normal">内容</TableHead>
          <TableHead className="w-24 whitespace-normal">状況</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell className={`font-medium ${wrapCellClass}`}>{formatDate(contact.created_at)}</TableCell>
            <TableCell className={wrapCellClass}>{contact.title}</TableCell>
            <TableCell className="whitespace-normal break-all align-top">{contact.email}</TableCell>
            <TableCell className={wrapCellClass}>{contact.content}</TableCell>
            <TableCell className={wrapCellClass}>
              <select
                className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
                value={contact.status}
                onChange={async (event) => {
                  await onStatusChange(contact.id, event.target.value)
                }}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ContactManageTable

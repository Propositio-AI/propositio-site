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
}

const ContactManageTable = ({ contacts }: ContactsProps) => {
  const formatDate = (value: string) => {
    return new Date(value).toLocaleDateString("ja-JP")
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">日付</TableHead>
          <TableHead>件名</TableHead>
          <TableHead>メールアドレス</TableHead>
          <TableHead>内容</TableHead>
          <TableHead>状況</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell className="font-medium">{formatDate(contact.created_at)}</TableCell>
            <TableCell>{contact.title}</TableCell>
            <TableCell>{contact.email}</TableCell>
            <TableCell>{contact.content}</TableCell>
            <TableCell>{contact.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ContactManageTable

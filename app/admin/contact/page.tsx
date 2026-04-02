'use client';

import { getAllContacts, updateContactStatus } from "@/app/actions/contact"
import { useEffect, useState } from "react"
import { Contact } from "@/lib/types"
import ContactManageTable from "@/components/parts/contact/ContactManageTable"
import Link from "next/link";

const ManageContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  useEffect(() => {
    const fetchAllContacts = async () => {
      try {
        const newContacts = await getAllContacts();
        setContacts(newContacts);
      }
      catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    fetchAllContacts();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateContactStatus(id, status);
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, status } : contact
      )
    );
  };

  return (
    <main className="mt-30 md:mt-40 mb-40 w-full px-6 sm:px-15">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">お問い合わせ管理</h1>
        <Link href="/admin" className="text-blue-500 hover:underline">
          DashBoardへ→
        </Link>
      </div>
      <ContactManageTable contacts={contacts} onStatusChange={handleStatusChange} />
    </main>
  )
}

export default ManageContactsPage

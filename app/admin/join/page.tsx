'use client';

import { getAllApplications } from "@/app/actions/join"
import { useEffect, useState } from "react"
import { Application } from "@/lib/types"
import ApplicationManageTable from "@/components/parts/join/ApplicationManageTable"
import Link from "next/link";

const ManageApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    const fetchAllApplications = async () => {
      try {
        const newApplications = await getAllApplications();
        setApplications(newApplications);
      }
      catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchAllApplications();
  }, []);

  return (
    <main className="mt-30 md:mt-40 mb-40 w-full px-4 sm:px-15">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">参加申し込み管理</h1>
        <Link href="/admin" className="text-blue-500 hover:underline">
          DashBoardへ→
        </Link>
      </div>
      <ApplicationManageTable applications={applications} />
    </main>
  )



}

export default ManageApplicationsPage

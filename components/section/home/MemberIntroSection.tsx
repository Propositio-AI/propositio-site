"use client";
import Link from "next/link"
import Image from "next/image"
import { FaArrowRightToBracket } from "react-icons/fa6";
import { motion } from "motion/react";


const MemberIntroSection = () => {
  return (
    <div id="members" className=" py-16 px-6 md:px-15">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">Members</h2>
      <div className="container mx-auto flex flex-col md:flex-row justify-around items-center gap-10">
        <motion.div className="w-full md:w-1/3"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}>
          <Image
            src="/images/members.png"
            alt="Member Introduction"
            width={900}
            height={600}
            className="w-full h-auto object-contain"
          />
        </motion.div>
        <div className="space-y-3 sm:w-1/2">
          <motion.h3 className="text-3xl md:text-5xl font-bold leading-tight"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            私たちは<br /><span className="text-blue-500">学生中心のチーム</span>です
          </motion.h3>
          <motion.p className="text-base md:text-lg text-muted-foreground"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            Propositio AIは、企画から運用までを全て<span className="text-black font-medium">学生のみ</span>で担うチームです。メンバーが主体的に協力しながらプロダクト成長に取り組み、情報系に限らず、多様なバックグラウンドのメンバーが活躍しています。
          </motion.p>
          <motion.div className="flex"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
          >
            <Link href="/members" className="ml-auto">
              <div className="flex items-center gap-4 pb-2 border-b-2 border-blue-500 w-max group group-hover:border-blue-600 transition-colors">
                <p className="font-medium">メンバーを見る</p>
                <div className="bg-blue-500 text-white py-1.5 px-4 group-hover:bg-blue-600 group-hover:rounded transition-colors">
                  <FaArrowRightToBracket className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MemberIntroSection

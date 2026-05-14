"use client";
import Link from "next/link";
import { FaArrowRightToBracket } from "react-icons/fa6";
import Image from "next/image";
import { motion } from "motion/react";



const JoinSection = () => {
  return (
    <div id="join"
      className="py-16 px-6 md:px-15 bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-600 mb-4 md:mb-6">Join</h2>

      <div className="grid md:grid-cols-2 gap-10 items-center md:px-16">
        <div>
          <motion.h3 className="text-3xl md:text-5xl font-bold leading-tight mb-3 md:mb-6"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            AI開発で、<br /><span className="text-green-500">「実力」と「実績」</span>を手に入れる
          </motion.h3>
          <motion.div className="relative w-full aspect-3/2 md:hidden mb-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <Image
              src="/images/join.png"
              alt="Join Image"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </motion.div>
          <motion.p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Propositio AIでは、LLMを活用したプロダクト開発を通して、実務レベルの開発経験とチーム開発力を身につけることができます。<br />
            就活で語れるガクチカや、エンジニアとしての実力を伸ばしたい人へ。
          </motion.p>
          <motion.div className="flex"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}>
            <Link href="/join" className="ml-auto">
              <div className="flex items-center gap-4 pb-2 border-b-2 border-green-500 w-max group group-hover:border-green-600 transition-colors">
                <p className="font-medium">メリット・募集詳細を見る</p>
                <div className="bg-green-500 text-white py-1.5 px-4 group-hover:bg-green-600 group-hover:rounded transition-colors">
                  <FaArrowRightToBracket className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </motion.div>

        </div>

        <motion.div className="relative w-full aspect-3/2 hidden md:block"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/join.png"
            alt="Join Image"
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-contain"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default JoinSection

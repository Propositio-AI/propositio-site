"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { FaArrowRightToBracket } from "react-icons/fa6";

const AboutSection = () => {
  return (
    <motion.div
      id="about"
      className="py-8 px-6 md:mt-10 md:px-15"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-gray-600 mb-4 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        About
      </motion.h2>

      <div className="container mx-auto md:flex md:flex-col md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-6xl font-semibold mb-2 md:mb-4">
            誰もが<span className="text-blue-500">夢を</span>持ち、自由に
            <span className="text-blue-500">追いかけられる</span>世界
          </h3>

          <p className="text-lg md:text-xl font-bold text-gray-700 mb-4 md:mb-12">
            <span className="block leading-tight">
              - DREAM FREELY, CHASE BOLDLY -
            </span>
          </p>
        </motion.div>

        <div className="container mx-auto flex flex-col-reverse gap-10 md:flex-row md:justify-around md:mb-20">
          <motion.div
            className="mb-10 md:mb-0 md:w-3/7 space-y-6 md:space-y-0"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed md:mt-10 mb-8">
              <span className="block mb-2 font-medium text-foreground">
                「夢を持つことに、一体どんな価値があるのか？」
              </span>

              <span className="block mb-4">
                私たちの答えは明確です。
              </span>

              <span className="block mb-4 font-semibold text-foreground">
                夢とは，自分の可能性を具体的な
                <span className="font-bold text-blue-500">「力」</span>
                に変えるための「北極星」であり、人生という航海における「GPS」です。
              </span>

              <span className="block mb-2">
                夢という目的地が定まった瞬間、
                これまで
                <span className="line-through opacity-70">
                  やらされる苦行
                </span>
                だった日々の学習は、
                自分を強化し、目的地へ到達するための
                <span className="font-semibold text-blue-500">
                  先行投資（装備を整えるプロセス）
                </span>
                へと劇的にその意味を変えます。
              </span>

              <span className="block">
                自分の可能性がどこに向かって解放されるべきか、
                その
                <span className="font-bold text-blue-500">
                  「ベクトル」
                </span>
                が決まること。
                これこそが、夢を持つことの真の価値です。
              </span>
            </p>

            <div className="flex">
              <Link href="/about" className="ml-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 pb-2 border-b-2 border-blue-500 w-max group group-hover:border-blue-600 transition-colors"
                >
                  <p className="font-medium">
                    企業概要を見る
                  </p>

                  <div className="bg-blue-500 text-white py-1.5 px-4 group-hover:bg-blue-600 group-hover:rounded transition-colors">
                    <FaArrowRightToBracket className="w-3 h-3" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="md:w-1/3"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="/images/history.png"
              alt="History"
              width={600}
              height={400}
              className="w-full h-auto object-contain md:pl-8 my-8 md:my-0"
            />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="my-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <dl className="flex flex-col gap-5 md:flex-row md:items-center md:justify-around">
          <div className="text-center font-bold">
            <dt className="text-lg text-muted-foreground mb-1">
              団体名
            </dt>

            <dd className="text-3xl mb-6 md:mb-0">
              Propositio AI
            </dd>
          </div>

          <div className="text-center font-bold">
            <dt className="text-lg text-muted-foreground mb-1">
              設立年月
            </dt>

            <dd className="text-3xl mb-6 md:mb-0">
              2024年11月
            </dd>
          </div>

          <div className="text-center font-bold">
            <dt className="text-lg text-muted-foreground mb-1">
              事業内容
            </dt>

            <dd className="text-3xl mb-6 md:mb-0">
              EdTech事業
            </dd>
          </div>
        </dl>
      </motion.div>
    </motion.div>
  );
};

export default AboutSection;
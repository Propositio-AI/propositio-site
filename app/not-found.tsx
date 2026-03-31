'use client';

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ShimmeringText } from "@/components/unlumen-ui/shimmering-text";
import { ShimmerSkeleton } from "@/components/unlumen-ui/shimmer-skeleton";
import { useRouter } from "next/navigation";

const NotFound = () => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [seconds, setSeconds] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 24000);

    return () => clearTimeout(timeout);
  }, [router]);

  useEffect(()=> {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev<= 1) return 0;
        return prev - 1
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const phrases = [
  "404 Error",
  "Route not found...",
  "The requested path does not exist",
  `Redirecting to the home page in ${seconds} second${seconds !== 1 ? "s" : ""}`,
];

  return (
    <main>
      <div className="mt-30 md:mt-40 mb-20 w-full px-6 md:px-15 flex flex-col items-center">
        <div className="space-y-4">
          <div className="bg-muted/10 flex items-center justify-center rounded-lg py-4 px-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <ShimmeringText text={phrases[currentIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="w-full max-w-sm md:max-w-lg space-y-4 p-4">
          {/* Card skeleton */}
          <div className="space-y-3">
            <ShimmerSkeleton
              className="h-40 md:h-60 w-full"
              rounded="lg"
            />
            <div className="flex items-center gap-3">
              <ShimmerSkeleton
                className="h-10 w-10 md:h-15 md:w-15 shrink-0"
                rounded="full"
              />
              <div className="flex-1 space-y-2">
                <ShimmerSkeleton className="h-3.5 w-3/4 " />
                <ShimmerSkeleton className="h-3 w-1/2" />
              </div>
            </div>
            <ShimmerSkeleton className="h-3 w-full" />
            <ShimmerSkeleton className="h-3 w-5/6" />
            <ShimmerSkeleton className="h-3 w-4/6" />
          </div>
        </div>
      </div>
    </main >
  )
}

export default NotFound
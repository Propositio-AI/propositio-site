import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**

Tailwindのクラス名を条件付きで結合し、重複を解決する。

@param inputs 結合したいクラス名（文字列・条件式・配列など）
@return マージ済みのクラス名文字列

**/
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

const Navigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex justify-center gap-3">
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/#aboutSection" className="text-base md:text-lg">About</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/#productsSection" className="text-base md:text-lg">Products</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/#membersSection" className="text-base md:text-lg">Members</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/#joinSection" className="text-base md:text-lg">Join</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/contact" className="text-base md:text-lg">Contact</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default Navigation

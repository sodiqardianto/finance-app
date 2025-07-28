"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, BarChart3, Settings, PlusCircle, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BottomNav() {
  const pathname = usePathname()
  const [showAddMenu, setShowAddMenu] = useState(false)

  const navItems = [
    { href: "/", icon: Home, label: "Beranda" },
    { href: "/transactions", icon: BarChart3, label: "Riwayat" },
    { href: "/reports", icon: TrendingUp, label: "Laporan" },
    { href: "/settings", icon: Settings, label: "Pengaturan" },
  ]

  return (
    <>
      {/* Overlay */}
      {showAddMenu && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40" onClick={() => setShowAddMenu(false)} />
      )}

      {/* Add Menu */}
      {showAddMenu && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-background rounded-2xl shadow-lg p-4 min-w-[200px]">
            <Link href="/add-income" onClick={() => setShowAddMenu(false)}>
              <Button variant="ghost" className="w-full justify-start mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Plus className="w-4 h-4 text-green-600" />
                </div>
                Tambah Pemasukan
              </Button>
            </Link>
            <Link href="/add-expense" onClick={() => setShowAddMenu(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <Plus className="w-4 h-4 text-red-600" />
                </div>
                Tambah Pengeluaran
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-30">
        <div className="flex items-center justify-around py-2">
          {/* First two items */}
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div className="flex flex-col items-center py-2">
                  <item.icon className={cn("w-6 h-6 mb-1", isActive ? "text-blue-600" : "text-muted-foreground")} />
                  <span className={cn("text-xs", isActive ? "text-blue-600 font-medium" : "text-muted-foreground")}>
                    {item.label}
                  </span>
                </div>
              </Link>
            )
          })}

          {/* Add Button in Center */}
          <div className="flex-1 flex justify-center">
            <Button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
              size="icon"
            >
              <PlusCircle className="w-7 h-7" />
            </Button>
          </div>

          {/* Last two items */}
          {navItems.slice(2, 4).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div className="flex flex-col items-center py-2">
                  <item.icon className={cn("w-6 h-6 mb-1", isActive ? "text-blue-600" : "text-muted-foreground")} />
                  <span className={cn("text-xs", isActive ? "text-blue-600 font-medium" : "text-muted-foreground")}>
                    {item.label}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

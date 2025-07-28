"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Trash2, Download, Upload, Moon, Bell, Shield, Tag, ChevronRight } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "@/components/theme-provider"

export default function Settings() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(true)
  const { theme, toggleTheme } = useTheme()

  const handleExportData = () => {
    const transactions = localStorage.getItem("transactions") || "[]"
    const categories = localStorage.getItem("categories") || "{}"
    const exportData = {
      transactions: JSON.parse(transactions),
      categories: JSON.parse(categories),
      exportDate: new Date().toISOString(),
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", "keuangan-backup.json")
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)

          // Import transactions
          if (data.transactions) {
            localStorage.setItem("transactions", JSON.stringify(data.transactions))
          }

          // Import categories
          if (data.categories) {
            localStorage.setItem("categories", JSON.stringify(data.categories))
          }

          alert("Data berhasil diimpor!")
          router.push("/")
        } catch (error) {
          alert("File tidak valid!")
        }
      }
      reader.readAsText(file)
    }
  }

  const handleClearData = () => {
    if (confirm("Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.removeItem("transactions")
      localStorage.removeItem("categories")
      alert("Semua data telah dihapus!")
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white p-6">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Pengaturan</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Pengaturan Aplikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="notifications">Notifikasi</Label>
                  <p className="text-sm text-muted-foreground">Terima pengingat dan notifikasi</p>
                </div>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="darkMode">Mode Gelap</Label>
                  <p className="text-sm text-muted-foreground">Ubah tampilan ke mode gelap</p>
                </div>
              </div>
              <Switch id="darkMode" checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
          </CardContent>
        </Card>

        {/* Category Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Kelola Kategori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/categories">
              <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                    <Tag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium">Kategori Transaksi</p>
                    <p className="text-sm text-muted-foreground">Tambah, edit, atau hapus kategori</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Kelola Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleExportData} className="w-full justify-start bg-transparent" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Ekspor Data
            </Button>

            <div>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-file" />
              <Button
                onClick={() => document.getElementById("import-file")?.click()}
                className="w-full justify-start"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                Impor Data
              </Button>
            </div>

            <Button onClick={handleClearData} className="w-full justify-start bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Semua Data
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>Tentang Aplikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Versi:</strong> 1.0.0
              </p>
              <p>
                <strong>Dibuat dengan:</strong> Next.js & PWA
              </p>
              <p>
                <strong>Fitur:</strong> Offline-ready, Installable
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}

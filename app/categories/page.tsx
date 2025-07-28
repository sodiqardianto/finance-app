"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Tag, TrendingUp, TrendingDown } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Categories {
  income: string[]
  expense: string[]
}

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

const defaultCategories: Categories = {
  income: ["Gaji", "Freelance", "Bisnis", "Investasi", "Bonus"],
  expense: ["Makanan", "Transport", "Belanja", "Tagihan", "Hiburan", "Kesehatan", "Pendidikan"],
}

export default function Categories() {
  const [categories, setCategories] = useState<Categories>(defaultCategories)
  const [newCategory, setNewCategory] = useState("")
  const [selectedType, setSelectedType] = useState<"income" | "expense">("income")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    // Load categories from localStorage
    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      // Save default categories if none exist
      localStorage.setItem("categories", JSON.stringify(defaultCategories))
    }

    // Load transactions to check category usage
    const savedTransactions = localStorage.getItem("transactions")
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  const saveCategories = (newCategories: Categories) => {
    setCategories(newCategories)
    localStorage.setItem("categories", JSON.stringify(newCategories))
  }

  const addCategory = () => {
    if (!newCategory.trim()) return

    const updatedCategories = {
      ...categories,
      [selectedType]: [...categories[selectedType], newCategory.trim()],
    }

    saveCategories(updatedCategories)
    setNewCategory("")
    setIsAddDialogOpen(false)
  }

  const deleteCategory = (type: "income" | "expense", categoryToDelete: string) => {
    // Check if category is being used in transactions
    const isUsed = transactions.some((t) => t.type === type && t.category === categoryToDelete)

    if (isUsed) {
      alert(`Kategori "${categoryToDelete}" tidak dapat dihapus karena masih digunakan dalam transaksi.`)
      return
    }

    const updatedCategories = {
      ...categories,
      [type]: categories[type].filter((cat) => cat !== categoryToDelete),
    }

    saveCategories(updatedCategories)
  }

  const getCategoryUsageCount = (type: "income" | "expense", category: string) => {
    return transactions.filter((t) => t.type === type && t.category === category).length
  }

  const isDefaultCategory = (type: "income" | "expense", category: string) => {
    return defaultCategories[type].includes(category)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-800 dark:to-purple-900 text-white p-6">
        <div className="flex items-center mb-6">
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 dark:hover:bg-white/10 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <Tag className="w-6 h-6 mr-2" />
            <h1 className="text-xl font-bold">Kelola Kategori</h1>
          </div>
        </div>

        <p className="text-indigo-100 text-sm">Tambah, edit, atau hapus kategori pemasukan dan pengeluaran</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Add Category Button */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kategori Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Kategori Baru</DialogTitle>
              <DialogDescription>Pilih jenis dan masukkan nama kategori yang ingin ditambahkan.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Jenis Kategori</Label>
                <div className="flex space-x-2 mt-2">
                  <Button
                    type="button"
                    variant={selectedType === "income" ? "default" : "outline"}
                    onClick={() => setSelectedType("income")}
                    className={selectedType === "income" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Pemasukan
                  </Button>
                  <Button
                    type="button"
                    variant={selectedType === "expense" ? "default" : "outline"}
                    onClick={() => setSelectedType("expense")}
                    className={selectedType === "expense" ? "bg-red-600 hover:bg-red-700" : ""}
                  >
                    <TrendingDown className="w-4 h-4 mr-2" />
                    Pengeluaran
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="categoryName">Nama Kategori</Label>
                <Input
                  id="categoryName"
                  placeholder="Masukkan nama kategori"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCategory()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={addCategory} disabled={!newCategory.trim()}>
                Tambah Kategori
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Income Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <TrendingUp className="w-5 h-5 mr-2" />
              Kategori Pemasukan ({categories.income.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {categories.income.map((category) => {
                const usageCount = getCategoryUsageCount("income", category)
                const isDefault = isDefaultCategory("income", category)
                return (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{category}</p>
                        <div className="flex items-center space-x-2">
                          {isDefault && <Badge variant="secondary">Default</Badge>}
                          <span className="text-xs text-muted-foreground">
                            {usageCount} transaksi menggunakan kategori ini
                          </span>
                        </div>
                      </div>
                    </div>
                    {!isDefault && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus kategori "{category}"?
                              {usageCount > 0 && (
                                <span className="block mt-2 text-red-600 font-medium">
                                  Peringatan: Kategori ini digunakan dalam {usageCount} transaksi dan tidak dapat
                                  dihapus.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCategory("income", category)}
                              disabled={usageCount > 0}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <TrendingDown className="w-5 h-5 mr-2" />
              Kategori Pengeluaran ({categories.expense.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {categories.expense.map((category) => {
                const usageCount = getCategoryUsageCount("expense", category)
                const isDefault = isDefaultCategory("expense", category)
                return (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{category}</p>
                        <div className="flex items-center space-x-2">
                          {isDefault && <Badge variant="secondary">Default</Badge>}
                          <span className="text-xs text-muted-foreground">
                            {usageCount} transaksi menggunakan kategori ini
                          </span>
                        </div>
                      </div>
                    </div>
                    {!isDefault && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menghapus kategori "{category}"?
                              {usageCount > 0 && (
                                <span className="block mt-2 text-red-600 font-medium">
                                  Peringatan: Kategori ini digunakan dalam {usageCount} transaksi dan tidak dapat
                                  dihapus.
                                </span>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteCategory("expense", category)}
                              disabled={usageCount > 0}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Tips:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Kategori default tidak dapat dihapus</li>
                <li>Kategori yang sedang digunakan dalam transaksi tidak dapat dihapus</li>
                <li>Anda dapat menambahkan kategori custom sesuai kebutuhan</li>
                <li>Kategori baru akan langsung tersedia saat menambah transaksi</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}

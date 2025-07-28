"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, TrendingDown } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

const defaultExpenseCategories = [
  "Makanan",
  "Transport",
  "Belanja",
  "Tagihan",
  "Hiburan",
  "Kesehatan",
  "Pendidikan",
  "Lainnya",
]

export default function AddExpense() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [expenseCategories, setExpenseCategories] = useState(defaultExpenseCategories)

  useEffect(() => {
    // Load categories from localStorage
    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      const categories = JSON.parse(savedCategories)
      setExpenseCategories(categories.expense || defaultExpenseCategories)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description || !category) return

    setLoading(true)

    const transaction = {
      id: Date.now().toString(),
      type: "expense" as const,
      amount: Number.parseFloat(amount),
      description,
      category,
      date: new Date().toISOString(),
    }

    // Save to localStorage
    const existingTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
    const updatedTransactions = [...existingTransactions, transaction]
    localStorage.setItem("transactions", JSON.stringify(updatedTransactions))

    setLoading(false)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-red-600 to-pink-700 dark:from-red-800 dark:to-pink-900 text-white p-6">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 dark:hover:bg-white/10 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <TrendingDown className="w-6 h-6 mr-2" />
            <h1 className="text-xl font-bold">Tambah Pengeluaran</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Detail Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="amount">Jumlah (IDR)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg font-semibold"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  placeholder="Contoh: Makan siang"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Kategori</Label>
                  <Link href="/categories">
                    <Button variant="ghost" size="sm" className="text-xs">
                      Kelola Kategori
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {expenseCategories.map((cat) => (
                    <Button
                      key={cat}
                      type="button"
                      variant={category === cat ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading || !amount || !description || !category}
              >
                {loading ? "Menyimpan..." : "Simpan Pengeluaran"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}

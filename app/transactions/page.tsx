"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, TrendingUp, TrendingDown, Search, Filter } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"
import Link from "next/link"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
    setTransactions(savedTransactions)
    setFilteredTransactions(savedTransactions)
  }, [])

  useEffect(() => {
    let filtered = transactions

    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredTransactions(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  }, [transactions, searchTerm, filterType])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 text-white p-6">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 dark:hover:bg-white/10 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Riwayat Transaksi</h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-green-300 mx-auto mb-2" />
              <p className="text-green-300 text-sm">Total Pemasukan</p>
              <p className="font-bold">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/20">
            <CardContent className="p-4 text-center">
              <TrendingDown className="w-6 h-6 text-red-300 mx-auto mb-2" />
              <p className="text-red-300 text-sm">Total Pengeluaran</p>
              <p className="font-bold">{formatCurrency(totalExpense)}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filter */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Cari transaksi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              Semua
            </Button>
            <Button
              variant={filterType === "income" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("income")}
              className={filterType === "income" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Pemasukan
            </Button>
            <Button
              variant={filterType === "expense" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("expense")}
              className={filterType === "expense" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Pengeluaran
            </Button>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">Tidak ada transaksi ditemukan</p>
              <p className="text-sm text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <TrendingDown className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { BottomNav } from "@/components/bottom-nav"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [balance, setBalance] = useState(0)
  const [income, setIncome] = useState(0)
  const [expense, setExpense] = useState(0)

  useEffect(() => {
    // Load data from localStorage
    const savedTransactions = localStorage.getItem("transactions")
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions)
      setTransactions(parsedTransactions)
      calculateTotals(parsedTransactions)
    }
  }, [])

  const calculateTotals = (transactions: Transaction[]) => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

    setIncome(totalIncome)
    setExpense(totalExpense)
    setBalance(totalIncome - totalExpense)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 text-white p-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Halo! 👋</h1>
            <p className="text-blue-100">Kelola keuangan Anda</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <Card className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-blue-100 text-sm mb-2">Saldo Total</p>
              <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ArrowDownRight className="w-4 h-4 text-green-300 mr-1" />
                  <span className="text-green-300 text-sm">Pemasukan</span>
                </div>
                <p className="font-semibold">{formatCurrency(income)}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <ArrowUpRight className="w-4 h-4 text-red-300 mr-1" />
                  <span className="text-red-300 text-sm">Pengeluaran</span>
                </div>
                <p className="font-semibold">{formatCurrency(expense)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Transaksi Terbaru</h2>
          <Button variant="ghost" size="sm">
            Lihat Semua
          </Button>
        </div>

        {recentTransactions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">Belum ada transaksi</p>
              <p className="text-sm text-muted-foreground">Mulai tambahkan pemasukan atau pengeluaran Anda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
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
                          <span className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString("id-ID")}
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

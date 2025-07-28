"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, TrendingDown, PieChart, DollarSign, Target } from "lucide-react"
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

interface CategorySummary {
  category: string
  amount: number
  count: number
  percentage: number
}

export default function Reports() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month")
  const [incomeCategories, setIncomeCategories] = useState<CategorySummary[]>([])
  const [expenseCategories, setExpenseCategories] = useState<CategorySummary[]>([])

  useEffect(() => {
    const savedTransactions = JSON.parse(localStorage.getItem("transactions") || "[]")
    setTransactions(savedTransactions)
    calculateCategoryStats(savedTransactions)
  }, [selectedPeriod])

  const calculateCategoryStats = (transactions: Transaction[]) => {
    const now = new Date()
    const startDate = new Date()

    switch (selectedPeriod) {
      case "week":
        startDate.setDate(now.getDate() - 7)
        break
      case "month":
        startDate.setMonth(now.getMonth() - 1)
        break
      case "year":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    const filteredTransactions = transactions.filter((t) => new Date(t.date) >= startDate)

    // Calculate income categories
    const incomeTransactions = filteredTransactions.filter((t) => t.type === "income")
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)

    const incomeStats = incomeTransactions.reduce(
      (acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = { amount: 0, count: 0 }
        }
        acc[t.category].amount += t.amount
        acc[t.category].count += 1
        return acc
      },
      {} as Record<string, { amount: number; count: number }>,
    )

    const incomeCategories = Object.entries(incomeStats)
      .map(([category, stats]) => ({
        category,
        amount: stats.amount,
        count: stats.count,
        percentage: totalIncome > 0 ? (stats.amount / totalIncome) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    // Calculate expense categories
    const expenseTransactions = filteredTransactions.filter((t) => t.type === "expense")
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)

    const expenseStats = expenseTransactions.reduce(
      (acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = { amount: 0, count: 0 }
        }
        acc[t.category].amount += t.amount
        acc[t.category].count += 1
        return acc
      },
      {} as Record<string, { amount: number; count: number }>,
    )

    const expenseCategories = Object.entries(expenseStats)
      .map(([category, stats]) => ({
        category,
        amount: stats.amount,
        count: stats.count,
        percentage: totalExpense > 0 ? (stats.amount / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)

    setIncomeCategories(incomeCategories)
    setExpenseCategories(expenseCategories)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getPeriodText = () => {
    switch (selectedPeriod) {
      case "week":
        return "7 Hari Terakhir"
      case "month":
        return "30 Hari Terakhir"
      case "year":
        return "1 Tahun Terakhir"
    }
  }

  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.amount, 0)
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0)
  const netIncome = totalIncome - totalExpense

  const getProgressBarColor = (type: "income" | "expense") => {
    return type === "income" ? "bg-green-500" : "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 dark:from-purple-800 dark:to-indigo-900 text-white p-6">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 dark:hover:bg-white/10 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center">
            <PieChart className="w-6 h-6 mr-2" />
            <h1 className="text-xl font-bold">Laporan Keuangan</h1>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2 mb-4">
          {(["week", "month", "year"] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={
                selectedPeriod === period
                  ? "bg-white text-purple-700"
                  : "text-white hover:bg-white/20 dark:hover:bg-white/10"
              }
            >
              {period === "week" ? "Minggu" : period === "month" ? "Bulan" : "Tahun"}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 text-center">
              <TrendingUp className="w-5 h-5 text-green-300 mx-auto mb-1" />
              <p className="text-green-300 text-xs">Pemasukan</p>
              <p className="font-bold text-sm">{formatCurrency(totalIncome)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 text-center">
              <TrendingDown className="w-5 h-5 text-red-300 mx-auto mb-1" />
              <p className="text-red-300 text-xs">Pengeluaran</p>
              <p className="font-bold text-sm">{formatCurrency(totalExpense)}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/20">
            <CardContent className="p-3 text-center">
              <DollarSign className="w-5 h-5 text-blue-300 mx-auto mb-1" />
              <p className="text-blue-300 text-xs">Selisih</p>
              <p className={`font-bold text-sm ${netIncome >= 0 ? "text-green-300" : "text-red-300"}`}>
                {formatCurrency(netIncome)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Laporan {getPeriodText()}</h2>
          <p className="text-muted-foreground text-sm">Analisis kategori pemasukan dan pengeluaran</p>
        </div>

        {/* Income Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-600">
              <TrendingUp className="w-5 h-5 mr-2" />
              Kategori Pemasukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incomeCategories.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Tidak ada data pemasukan</p>
            ) : (
              <div className="space-y-4">
                {incomeCategories.map((category) => (
                  <div key={category.category}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{category.category}</Badge>
                        <span className="text-sm text-muted-foreground">({category.count} transaksi)</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(category.amount)}</p>
                        <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted dark:bg-muted/50 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <TrendingDown className="w-5 h-5 mr-2" />
              Kategori Pengeluaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expenseCategories.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Tidak ada data pengeluaran</p>
            ) : (
              <div className="space-y-4">
                {expenseCategories.map((category) => (
                  <div key={category.category}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{category.category}</Badge>
                        <span className="text-sm text-muted-foreground">({category.count} transaksi)</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{formatCurrency(category.amount)}</p>
                        <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted dark:bg-muted/50 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Health Indicator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Kesehatan Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}>
                {netIncome >= 0 ? "😊" : "😟"}
              </div>
              <p className="text-lg font-semibold mb-2">{netIncome >= 0 ? "Keuangan Sehat!" : "Perlu Perhatian"}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {netIncome >= 0
                  ? `Anda berhasil menyisihkan ${formatCurrency(netIncome)} dalam periode ini.`
                  : `Pengeluaran melebihi pemasukan sebesar ${formatCurrency(Math.abs(netIncome))}.`}
              </p>

              {totalExpense > 0 && totalIncome > 0 && (
                <div className="bg-muted dark:bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Rasio Pengeluaran vs Pemasukan</p>
                  <div className="w-full bg-muted dark:bg-muted/70 rounded-full h-4 mb-2">
                    <div
                      className={`h-4 rounded-full ${totalExpense > totalIncome ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min((totalExpense / totalIncome) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {((totalExpense / totalIncome) * 100).toFixed(1)}% dari pemasukan digunakan
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}

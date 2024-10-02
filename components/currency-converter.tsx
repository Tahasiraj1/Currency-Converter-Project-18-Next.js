"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { ClipLoader } from "react-spinners";
import { Coins } from 'lucide-react';
import { Trash } from 'lucide-react';

type ExchangeRates = {
    [key: string]: number;
};

type Currency =
"USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR";

export default function CurrencyConverter() {
    const [amount, setAmount] = useState<number | null>(null);
    const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
    const [targetCurrency, setTargetCurrency] = useState<Currency>("PKR");
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
    const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>([]);
    const [convertedAmount, setConvertedAmount] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExchangeRates = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
                const data = await response.json();
                setExchangeRates(data.rates);
                setSupportedCurrencies(Object.keys(data.rates));
            } catch {
                setError("Error fetching exchange rates.");
            } finally {
                setLoading(false);
            }
        };
        fetchExchangeRates();
    }, []);

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setAmount(parseFloat(e.target.value));
    };

    const handleSourceCurrencyChange = (value: Currency): void => {
        setSourceCurrency(value);
    };

    const handleTargetCurrencyChange = (value: Currency): void => {
        setTargetCurrency(value);
    };

    const calculateConvertedAmount = (): void => {
        if (sourceCurrency && targetCurrency && amount && exchangeRates) {
            const rate = 
            sourceCurrency === "USD"
            ? exchangeRates[targetCurrency]
            : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];
            const result = amount * rate;
            setConvertedAmount(result.toFixed(2));
        }
    };

    const handleReset = (): void => {
        setAmount(null);
        setSourceCurrency("USD");
        setTargetCurrency("PKR");
        setConvertedAmount("")
    };

    return (
        <div className="p-4 sm:p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center h-screen bg-gradient-to-br from-yellow-300 to-orange-300">
            <Card className="w-full max-w-md p-6 space-y-4 bg-gradient-to-b from-yellow-100 to bg-white">
                <CardHeader className="text-center">
                    <div className="flex flex-row justify-center">
                        <Coins className="sm:mr-1" />
                    <CardTitle className="text-3xl font-bold mr-6">
                        Currency Converter
                    </CardTitle>
                    </div>
                    <CardDescription>
                        Convert between different currencies.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center">
                            <ClipLoader className="w-6 h-6" />
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center">{error}</div>
                    ) : (
                    <div className="grid gap-4">
                            {/* Amount input and source currency selection */}
                        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                            <Label htmlFor="from">From</Label>
                            <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                            <Input
                            id="from"
                            type="number"
                            placeholder="Amount"
                            value={amount || ""}
                            onChange={handleAmountChange}
                            className="w-full border-2 border-gray-200 rounded-full"
                            />
                            <Select
                            value={sourceCurrency}
                            onValueChange={handleSourceCurrencyChange}
                            >
                                <SelectTrigger className="w-24 rounded-3xl border-2 border-gray-200">
                                    <SelectValue placeholder="USD" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] rounded-2xl bg-gradient-to-br from-yellow-200 to-orange-200">
                                    <SelectGroup>
                                        {supportedCurrencies.map((currency) => (
                                            <SelectItem key={currency} value={currency}>
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            </div>
                        </div>
                    {/* Converted amount display and target currency selection */}
                    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                        <Label htmlFor="to">To</Label>
                        <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                            <div className="text-2xl font-bold animate-pulse">{convertedAmount}</div>
                            <Select
                            value={targetCurrency}
                            onValueChange={handleTargetCurrencyChange}
                            >
                                <SelectTrigger className="w-24 rounded-3xl border-2 border-gray-200">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] rounded-2xl bg-gradient-to-br from-yellow-200 to-orange-200">
                                    <SelectGroup>
                                        {supportedCurrencies.map((currency) => (
                                            <SelectItem key={currency} value={currency}>
                                                {currency}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    </div>
                    )}
                </CardContent>
                <CardFooter className="gap-2">
                    {/* Convert button */}
                    <Button
                    type="button"
                    className="w-full rounded-full active:scale-95 transition-transform transform duration:300"
                    onClick={calculateConvertedAmount}
                    >
                        Convert
                    </Button>
                    <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-500 rounded-full active:scale-95 transition-transform transform duration:300"
                    onClick={handleReset}
                    >
                        <Trash />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

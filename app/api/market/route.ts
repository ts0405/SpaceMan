import { NextResponse } from "next/server";

type Period = "1D" | "1W" | "1M" | "1Y";

type MarketData = {
  "1D": number;
  "1W": number;
  "1M": number;
  "1Y": number;
};

const symbols = {
  NASDAQ: "^NDX",
  BTC: "BTC-USD",
  USD: "USDJPY=X",
} as const;

function calculateChange(
  prices: { timestamp: number; close: number }[],
  days: number
) {
  if (prices.length === 0) return 0;

  const latest = prices[prices.length - 1];

  const targetTimestamp =
    latest.timestamp - days * 24 * 60 * 60;

  let target = prices[0];

  for (const price of prices) {
    if (price.timestamp <= targetTimestamp) {
      target = price;
    } else {
      break;
    }
  }

  if (!target.close) return 0;

  return ((latest.close - target.close) / target.close) * 100;
}

async function getMarketData(
  symbol: string
): Promise<MarketData> {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/` +
    `${encodeURIComponent(symbol)}` +
    `?range=1y&interval=1d`;

  const response = await fetch(url, {
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${symbol}: ${response.status}`
    );
  }

  const json = await response.json();

  const result = json?.chart?.result?.[0];

  if (!result) {
    throw new Error(`No data found for ${symbol}`);
  }

  const timestamps: number[] =
    result.timestamp ?? [];

  const closes: (number | null)[] =
    result.indicators?.quote?.[0]?.close ?? [];

  const prices = timestamps
    .map((timestamp, index) => ({
      timestamp,
      close: closes[index],
    }))
    .filter(
      (
        item
      ): item is {
        timestamp: number;
        close: number;
      } =>
        typeof item.close === "number" &&
        Number.isFinite(item.close)
    );

  return {
    "1D": calculateChange(prices, 1),
    "1W": calculateChange(prices, 7),
    "1M": calculateChange(prices, 30),
    "1Y": calculateChange(prices, 365),
  };
}

export async function GET() {
  try {
    const [NASDAQ, BTC, USD] =
      await Promise.all([
        getMarketData(symbols.NASDAQ),
        getMarketData(symbols.BTC),
        getMarketData(symbols.USD),
      ]);

    return NextResponse.json({
      NASDAQ,
      BTC,
      USD,
    });
  } catch (error) {
    console.error("Market API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch market data",
      },
      {
        status: 500,
      }
    );
  }
}
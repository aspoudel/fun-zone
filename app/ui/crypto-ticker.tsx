interface CryptoData {
  name: string;
  price: string;
  crypto_url: string;
}

interface CryptoTickerProps {
  data: CryptoData[];
}

export default function CryptoTicker({ data }: CryptoTickerProps) {
  return (
    <div className="overflow-hidden text-gray-500 w-10/12 m-auto">
      <p className="text-black">Crypto Currencies</p>
      <div className="flex animate-marquee whitespace-nowrap space-x-24">
        {data.map((crypto, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div>
              <p className="m-0 mb-2">{crypto.name}</p>
              <p className="text-green-400 text-xs m-0">{crypto.price}</p>
            </div>
            <img
              src={crypto.crypto_url}
              alt={crypto.name}
              className="w-6 h-6"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

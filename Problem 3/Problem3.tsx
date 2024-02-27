interface WalletBalance {
  currency: string;
  amount: number;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

class Datasource {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  async getPrices(): Promise<any> {
    try {
      const response = await fetch(this.url);
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

interface Props extends BoxProps {

}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
	const [prices, setPrices] = useState({});

  useEffect(() => {
    const datasource = new Datasource("https://interview.switcheo.com/prices.json");
    datasource.getPrices().then(prices => {
      setPrices(prices);
    }).catch(error => {
      console.error(error);
    });
  }, []);

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  /*
    remove redundant if-else to one line return

  */
  const sortedBalances = useMemo(() => {
    const sorted = balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  return balancePriority > -99 && balance.amount <= 0;
		  }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      return rightPriority - leftPriority; // Descending order
      });
      return sorted;
  }, [balances, prices]);

  /*
    Remove the formattedBalances function as i format it directly in 
    here.
  */
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.amount.toFixed()}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
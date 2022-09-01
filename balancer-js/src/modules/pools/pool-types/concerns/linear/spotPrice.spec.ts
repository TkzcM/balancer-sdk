import dotenv from 'dotenv';
import { expect } from 'chai';
import pools_14717479 from '@/test/lib/pools_14717479.json';
import { StaticPoolRepository } from '@/modules/data';
import { PoolsProvider } from '@/modules/pools/provider';
import { PoolModel, Pool } from '@/types';
import { Network } from '@/.';
import { setupPool } from '@/test/lib/utils';
import { LinearPoolSpotPrice } from './spotPrice.concern';
import { ADDRESSES } from '@/test/lib/constants';

dotenv.config();

const network = Network.MAINNET;
const rpcUrl = 'http://127.0.0.1:8545';

const spotPriceCalc = new LinearPoolSpotPrice();
const linearId =
  '0x9210f1204b5a24742eba12f710636d76240df3d00000000000000000000000fc';

describe('Linear pool spot price', () => {
  let pool: PoolModel | undefined;

  // Setup chain
  before(async function () {
    const sdkConfig = {
      network,
      rpcUrl,
    };
    // Using a static repository to make test consistent over time
    const poolsProvider = new PoolsProvider(
      sdkConfig,
      new StaticPoolRepository(pools_14717479 as Pool[])
    );
    pool = await setupPool(poolsProvider, linearId);
  });

  context('calcPoolSpotPrice', () => {
    it('should calculate spot price for pair', () => {
      const spotPrice = spotPriceCalc.calcPoolSpotPrice(
        ADDRESSES[network].USDC.address,
        ADDRESSES[network].bbausdc.address,
        pool as PoolModel
      );
      expect(spotPrice).to.eq('1.008078200925769181');
    });
  });
});

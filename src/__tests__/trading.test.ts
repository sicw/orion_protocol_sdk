import { ethers } from 'ethers';
import Orion from '../Orion';
import swapMarket from '../OrionUnit/Exchange/swapMarket';

// const privateKey = process.env['PRIVATE_KEY']
const privateKey = '69a3e1733205a6e2d17479856c8b985e40742b10df03f50597bfa726d2ad4d90'

if (privateKey === undefined) throw new Error('Private key is required');

jest.setTimeout(240000);

// 现货交易
describe('Spot trading', () => {

  // 简单模式
  test('Sell. Simple', async () => {
    // 获取测试环境,类似的还有production, staging环境
    const orion = new Orion('testing');
    // 获取bsc链
    const bscUnit = orion.getUnit('bsc');
    // 链接钱包
    const wallet = new ethers.Wallet(
      privateKey,
      bscUnit.provider
    );

    // 交易市场(卖出20个ORN 兑换USDT)
    const result = await swapMarket({
      assetIn: 'ORN',
      assetOut: 'USDT',
      amount: 20,
      type: 'exactSpend',
      signer: wallet,
      feeAsset: 'USDT',
      orionUnit: bscUnit,
      slippagePercent: 1,
      // options: {
      //   logger: console.log
      // }
    })
    await result.wait();
  });

  // 买10个USDT 用BNB交易
  test('Buy. Simple', async () => {
    const orion = new Orion('testing');
    const bscUnit = orion.getUnit('bsc');
    const wallet = new ethers.Wallet(
      privateKey,
      bscUnit.provider
    );

    const result = await bscUnit.exchange.swapMarket({
      assetIn: 'BNB',
      assetOut: 'USDT',
      amount: 15,
      type: 'exactReceive',
      signer: wallet,
      feeAsset: 'USDT',
      slippagePercent: 1,
      // options: {
      //   logger: console.log
      // }
    })
    const r = await result.wait();
    console.log(r)
  });

  test('Buy. Complex', async () => {
    const orion = new Orion('testing');
    const bscUnit = orion.getUnit('bsc');
    const wallet = new ethers.Wallet(
      privateKey,
      bscUnit.provider
    );

    const resultExactSpend = await bscUnit.exchange.swapMarket({
      assetIn: 'USDT',
      assetOut: 'BNB',
      amount: 40,
      type: 'exactSpend',
      signer: wallet,
      feeAsset: 'USDT',
      slippagePercent: 1,
      // options: {
      //   logger: console.log
      // }
    })
    await resultExactSpend.wait();

    const resultExactReceive = await bscUnit.exchange.swapMarket({
      assetIn: 'BNB',
      assetOut: 'BTC',
      amount: resultExactSpend.amountOut.toPrecision(3),
      type: 'exactSpend',
      signer: wallet,
      feeAsset: 'USDT',
      slippagePercent: 1,
      options: {
        logger: console.log
      }
    });
    await resultExactReceive.wait();

    // Return back to USDT
    const returnBackUsdt = await bscUnit.exchange.swapMarket({
      amount: 40,
      assetIn: 'BTC',
      assetOut: 'USDT',
      type: 'exactReceive',
      signer: wallet,
      feeAsset: 'USDT',
      slippagePercent: 1,
    });
    await returnBackUsdt.wait();
  });
});

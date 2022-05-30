import { z } from 'zod';
import MessageType from '../MessageType';
import baseMessageSchema from './baseMessageSchema';

const assetPairsConfigSchema = baseMessageSchema.extend({
  T: z.literal(MessageType.ASSET_PAIRS_CONFIG_UPDATE),
  k: z.enum(['i', 'u']),
  u: z.array(
    z.tuple([
      z.string(), // pairName
      z.number(), // minQty
      z.number(), // pricePrecision
    ]),
  ),
});

export default assetPairsConfigSchema;

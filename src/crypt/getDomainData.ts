import type { SupportedChainId } from '../types';
import eip712DomainData from '../config/eip712DomainData.json';
import eip712DomainSchema from '../config/schemas/eip712DomainSchema';

const EIP712Domain = eip712DomainSchema.parse(eip712DomainData);

function removeUndefined<T>(obj: Record<string, T | undefined>) {
  const newObj: Partial<Record<string, T>> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      newObj[key] = value;
    }
  }
  return newObj;
}

/**
 * See {@link https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator}
 */
const getDomainData = (chainId: SupportedChainId) => ({
  ...removeUndefined(EIP712Domain),
  chainId,
});

export default getDomainData;

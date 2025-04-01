import { PinataSDK } from 'pinata'

/**
 * Pinata IPFS client instance for decentralized storage operations.
 *
 * @description This module initializes and exports a PinataSDK client instance configured
 * with environment variables for authentication and gateway access. The client is used
 * throughout the application for interacting with IPFS through Pinata's infrastructure.
 *
 * The client is configured with:
 * - JWT token for authentication (from PINATA_JWT environment variable)
 * - Custom gateway URL for accessing pinned content (from GATEWAY_URL environment variable)
 *
 * This instance provides methods for:
 * - Uploading files to IPFS
 * - Pinning content
 * - Managing pins
 * - Accessing pinned content through the configured gateway
 *
 * @example
 * // Upload a file to IPFS
 * const result = await pinata.pinFileToIPFS(file);
 * // Access pinned content
 * const content = await pinata.getFileFromIPFS(hash);
 */
export const pinata = new PinataSDK({
  pinataJwt: import.meta.env.PINATA_JWT,
  pinataGateway: import.meta.env.GATEWAY_URL,
})

import { swagger } from '@elysiajs/swagger';
import { Elysia } from "elysia";
import { tokensByStatus } from '@mintbase-js/data'
import { NEAR_NETWORKS } from '@mintbase-js/sdk';

const app = new Elysia({ prefix: '/api', aot: false })
    .use(swagger())
    .get("/", async ({ headers }) => {

        const mbMetadata = JSON.parse(headers["mb-metadata"] || "{}")
        const accountId = mbMetadata?.accountData?.accountId || "near"

        const props = {
            metadataId: process.env.NFT_METADATA_ID!,
            ownedBy: accountId,
            network: NEAR_NETWORKS.MAINNET
        }

        const { data, error } = await tokensByStatus(props);

        const ownsAtLeastOne = data?.listedTokens && data?.listedTokens.length > 0 || data?.unlistedTokens && data?.unlistedTokens.length > 0

        if (error) { console.log('error', error) }

        if (ownsAtLeastOne) {

            return {
                result: "You are an owner of some drops"
            }
        }

        return {
            result: `Please claim the drop first at ${process.env.NFT_CLAIM_DROP_URL}`
        };
    })
    .compile()


export const GET = app.handle
export const POST = app.handle
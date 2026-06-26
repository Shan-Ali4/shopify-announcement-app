import { authenticate } from "../shopify.server";
import { connectDB } from "../lib/mongodb";
import Announcement from "../models/Announcement";

export async function action({ request }) {
  try {
    const { admin } = await authenticate.admin(request);
    const body = await request.json();
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) {
      return Response.json(
        {
          success: false,
          error: "Announcement text is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Save to MongoDB
    await connectDB();

    const announcement = await Announcement.create({
      text,
    });

    const shopResponse = await admin.graphql(
      `#graphql
      query ShopId {
        shop {
          id
        }
      }`
    );

    const shopResult = await shopResponse.json();
    const shopId = shopResult.data?.shop?.id;

    if (!shopId) {
      throw new Error("Unable to resolve authenticated shop ID.");
    }

    // Save to Shopify Shop Metafield
    const response = await admin.graphql(
      `#graphql
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          metafields: [
            {
              ownerId: shopId,
              namespace: "my_app",
              key: "announcement",
              type: "single_line_text_field",
              value: text,
            },
          ],
        },
      }
    );

    const metafieldResult = await response.json();
    const userErrors = metafieldResult.data?.metafieldsSet?.userErrors ?? [];

    if (userErrors.length > 0) {
      return Response.json(
        {
          success: false,
          error: "Shopify rejected the announcement metafield.",
          userErrors,
        },
        {
          status: 422,
        }
      );
    }

    return Response.json({
      success: true,
      announcement,
      metafieldResult,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}

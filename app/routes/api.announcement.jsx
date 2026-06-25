import { authenticate } from "../shopify.server";
import { connectDB } from "../lib/mongodb";
import Announcement from "../models/Announcement";

export async function action({ request }) {
  try {
    const { admin } = await authenticate.admin(request);

    const body = await request.json();

    // Save to MongoDB
    await connectDB();

    const announcement = await Announcement.create({
      text: body.text,
    });

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
              ownerId: "gid://shopify/Shop/66668986462",
              namespace: "my_app",
              key: "announcement",
              type: "single_line_text_field",
              value: body.text,
            },
          ],
        },
      }
    );

    const metafieldResult = await response.json();

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
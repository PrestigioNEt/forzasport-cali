import { redirect } from 'next/navigation';

export default function AccountPage() {
  // Redirect to Shopify account page
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accountUrl = `https://${shopifyDomain}/account`;

  redirect(accountUrl);
}

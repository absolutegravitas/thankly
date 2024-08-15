import React from 'react'
import { Order, Product } from '@/payload-types'
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function OrderConfirmationEmail({ order }: { order: Order }) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for your order from Thankly!</Preview>
      <Body className="bg-green-50 font-sans">
        <Container className="mx-auto max-w-2xl">
          <Section className="bg-white mt-8 rounded-lg shadow-lg overflow-hidden">
            <Row className="bg-green-700 p-4">
              <Column>
                <Img
                  src={`${baseUrl}/logo.png`}
                  width="100"
                  height="50"
                  alt="Thankly logo"
                  className="mx-auto"
                />
              </Column>
            </Row>

            <Section className="px-8 py-6">
              <Heading className="text-2xl font-bold text-green-700 mb-4">
                Your order is confirmed!
              </Heading>
              <Text className="text-gray-700 mb-4">Hi {order.billing?.name || 'there'},</Text>
              <Text className="text-gray-700 mb-4">
                Thank you for your order. We're getting your thoughtful gift ready to impress!
              </Text>
              <Button
                href={`https://thankly.co/shop/order?id=${order.orderNumber}`}
                className="bg-green-700 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
              >
                View Order Details
              </Button>
            </Section>

            <Hr className="border-gray-300 my-6" />

            <Section className="px-8 py-6">
              <Heading className="text-xl font-semibold text-green-700 mb-4">Order Summary</Heading>
              <Text className="text-gray-700 mb-2">Order Number: {order.orderNumber}</Text>
              <Text className="text-gray-700 mb-4">Order Date: {formatDate(order.createdAt)}</Text>

              {order.items && order.items.length > 0 && (
                <table className="w-full mb-4">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-700">Item</th>
                      <th className="text-right text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="text-gray-700">{(item.product as Product).title}</td>
                        <td className="text-right text-gray-700">${item.price?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <Hr className="border-gray-300 my-4" />

              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-gray-700 font-semibold">Subtotal</td>
                    <td className="text-right text-gray-700">${order.totals.cost.toFixed(2)}</td>
                  </tr>
                  {order.totals.shipping && (
                    <tr>
                      <td className="text-gray-700">Shipping</td>
                      <td className="text-right text-gray-700">
                        ${order.totals.shipping.toFixed(2)}
                      </td>
                    </tr>
                  )}
                  {order.totals.discount && (
                    <tr>
                      <td className="text-gray-700">Discount</td>
                      <td className="text-right text-gray-700">
                        -${order.totals.discount.toFixed(2)}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="text-green-700 font-bold">Total</td>
                    <td className="text-right text-green-700 font-bold">
                      ${order.totals.total.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr className="border-gray-300 my-6" />

            <Section className="px-8 py-6 bg-green-100">
              <Text className="text-center text-gray-700 mb-4">
                Your gift is about to make someone's day! You'll hear from us again when it's
                shipped.
              </Text>
              <Text className="text-center text-gray-700">
                Cheers,
                <br />
                The Thankly Team
              </Text>
            </Section>

            <Hr className="border-gray-300 my-6" />

            <Section className="px-8 py-6 bg-green-700 text-white">
              <Row>
                <Column className="text-center">
                  <Link href="https://www.instagram.com/thankly.co/">
                    <Img
                      src={`${baseUrl}/instagram-icon.svg`}
                      width="32"
                      height="32"
                      alt="Instagram"
                      className="mx-auto"
                    />
                  </Link>
                </Column>
                <Column className="text-center">
                  <Link href="https://www.facebook.com/thankly.co">
                    <Img
                      src={`${baseUrl}/facebook-icon.svg`}
                      width="32"
                      height="32"
                      alt="Facebook"
                      className="mx-auto"
                    />
                  </Link>
                </Column>
                <Column className="text-center">
                  <Link href="https://au.linkedin.com/company/thankly-personalisedgifts">
                    <Img
                      src={`${baseUrl}/linkedin-icon.svg`}
                      width="32"
                      height="32"
                      alt="LinkedIn"
                      className="mx-auto"
                    />
                  </Link>
                </Column>
              </Row>
            </Section>

            <Section className="px-8 py-6 bg-gray-100">
              <Text className="text-center text-gray-600 text-xs">
                © 2024 Thankly. All rights reserved.
                <br />
                [Footer placeholder for additional information]
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// import { Order } from '@/payload-types'
// import {
//   Body,
//   Button,
//   Column,
//   Container,
//   Font,
//   Head,
//   Heading,
//   Img,
//   Preview,
//   Row,
//   Section,
//   Tailwind,
//   Text,
//   Hr,
// } from '@react-email/components'

// const baseUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL : ''

// export default function (order: Order) {
//   return (
//     <Tailwind>
//       <Head>
//         <Font
//           fontFamily="Inter"
//           fallbackFontFamily="Verdana"
//           webFont={{
//             url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
//             format: 'woff2',
//           }}
//           fontWeight={400}
//           fontStyle="normal"
//         />
//       </Head>
//       <Preview>Thanks for your order!</Preview>
//       <Body className="bg-gray-100 text-gray-800">
//         <Container className="rounded-lg border border-solid border-gray-200 bg-white p-12 shadow-md">
//           <Row>
//             <Column className="w-[80px]">
//               <Img src={`${baseUrl}/icon.png`} width="60" height="60" alt={`thankly logo`} />
//             </Column>
//             <Column>
//               <Heading as="h2" className="text-2xl font-bold text-gray-800">
//                 All your cards are belong to us...
//               </Heading>
//             </Column>
//           </Row>
//           <Section>
//             <Text className="text-gray-700">{`Hi there,`}</Text>
//             <Text className="text-gray-700">{`Thank you for your order!`}</Text>
//             <Button
//               className="cursor-pointer rounded-md border border-solid border-blue-600 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
//               href={`#`}
//             >
//               View Order Details
//             </Button>
//             <Text className="text-gray-700">{`Order Number: ${order.orderNumber}`}</Text>
//           </Section>
//           <Hr className="border-gray-300 my-6" />
//           <Section>
//             <Heading as="h3" className="text-lg font-semibold text-gray-800">
//               Order Details (JSON):
//             </Heading>
//             <Text className="bg-gray-100 p-4 rounded font-mono text-xs whitespace-pre-wrap break-all">
//               {JSON.stringify(order, null, 2)}
//             </Text>
//           </Section>
//         </Container>
//       </Body>
//     </Tailwind>
//   )
// }

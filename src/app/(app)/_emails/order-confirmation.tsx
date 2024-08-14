import { Order } from '@/payload-types'
import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Img,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
  Hr,
} from '@react-email/components'

const baseUrl = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_SITE_URL : ''

export default function OrderConfirmationEmail(order: Order) {
  return (
    <Tailwind>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Thanks for your order!</Preview>
      <Body className="bg-gray-100 text-gray-800">
        <Container className="rounded-lg border border-solid border-gray-200 bg-white p-12 shadow-md">
          <Row>
            <Column className="w-[80px]">
              <Img src={`${baseUrl}/icon.png`} width="60" height="60" alt={`thankly logo`} />
            </Column>
            <Column>
              <Heading as="h2" className="text-2xl font-bold text-gray-800">
                All your cards are belong to us...
              </Heading>
            </Column>
          </Row>
          <Section>
            <Text className="text-gray-700">{`Hi there,`}</Text>
            <Text className="text-gray-700">{`Thank you for your order!`}</Text>
            <Button
              className="cursor-pointer rounded-md border border-solid border-blue-600 bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              href={`#`}
            >
              View Order Details
            </Button>
            <Text className="text-gray-700">{`Order Number: ${order.orderNumber}`}</Text>
          </Section>
          <Hr className="border-gray-300 my-6" />
          <Section>
            <Heading as="h3" className="text-lg font-semibold text-gray-800">
              Order Details (JSON):
            </Heading>
            <Text className="bg-gray-100 p-4 rounded font-mono text-xs whitespace-pre-wrap break-all">
              {JSON.stringify(order, null, 2)}
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  )
}

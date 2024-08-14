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
      <Body className="bg-zinc-900 text-zinc-300">
        <Container className="rounded-lg border border-solid border-white/[0.03] bg-zinc-800 p-12">
          <Row>
            <Column className="w-[80px]">
              <Img src={`${baseUrl}/icon.png`} width="60" height="60" alt={`thankly logo`} />
            </Column>
            <Column>
              <Heading as="h2" className="text-2xl font-bold text-white">
                Reset Passoword
              </Heading>
            </Column>
          </Row>
          <Section>
            <Text className="dark:text-zinc-300">{`Hi there,`}</Text>
            <Text className="dark:text-zinc-300">{`Thank you for your order!`}</Text>
            <Button
              className="cursor-pointer rounded-md border border-solid border-blue-700 bg-blue-600 px-4 py-2 text-white"
              href={`#`}
            >
              View Order Details
            </Button>
            <Text className="dark:text-zinc-300">{`Order Number: ${order.orderNumber}`}</Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  )
}
